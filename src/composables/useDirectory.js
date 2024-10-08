import { useAuthStore } from "src/stores/auth";
import { useRouter } from 'vue-router'

const authStore = useAuthStore();
const router = useRouter();

const pwaDirectory = "pwaDirectory";
const pwaOrgSettings = "pwaOrgSettings";
const vendiBaseURL = "vendiBaseURL";

export function useDirectory() {

  async function init() {
    let url = location.hostname;
    // let userAgent = window.navigator.userAgent;

    let defaultSettings = {
      timeZone: 0,
      countryCode: "ZAF",
      organisationID: 0,
      organisationName: "",
      organisationProvider: "PWA"
    };

    if (url === "localhost") url = "pwa-localhost";
    const response = await getDirectoryData(url);

    if (response.ok) {
      //store the settings;
      localStorage.setItem(pwaDirectory, JSON.stringify(response.data));

      if(parseInt(getSettingValue("timeZone")))
        defaultSettings.timeZone = parseInt(getSettingValue("timeZone"));

      if(parseInt(getSettingValue("countryCode")))
        defaultSettings.countryCode = getSettingValue("countryCode");

      if(parseInt(getSettingValue("organisationID")))
        defaultSettings.organisationID = parseInt(getSettingValue("organisationID"));

      if(parseInt(getSettingValue("organisationName")))
        defaultSettings.organisationName = getSettingValue("organisationName");

      if(parseInt(getSettingValue("organisationProvider")))
        defaultSettings.organisationProvider = getSettingValue("organisationProvider");

      localStorage.setItem(pwaOrgSettings, JSON.stringify(defaultSettings));

      //Get the base URL for monolith mainly
      const defaultUrl = getProviderURL("monolith");
      // VueCookie.set(vendiBaseURL, defaultUrl, 100);
    }
    return response.ok;
  }
  async function getDirectoryData(url){
    let res;
    await base.api.get("https://directory.netvendor.co.za/directory", {
        params: {
          url: url
        }
      })
      .then(data => {
        res = data;
      })
      .catch(error => {
        res = { ok: false, data: "", msg: "An error has occured while prcessing your request!"};
      });

      return res;
  }

  function getSettingValue(setting) {
    const settings = getDirectoryObject();
    if (settings && settings.settings) {
      let o = getObject(settings.settings, setting);
      if (o) return o.value;
    }
    return null;
  }

  function getObject(lstItems, key) {
    const item = lstItems.find(x => x.key === key);
    if (item && item.value) {
      console.log("Item found: " + key);
      return item;
    }
    return null;
  }

  return { init, getSettingValue, getObject };
}
