import { Paper, styled } from "@mui/material";
import { createTheme, Theme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import createCache from '@emotion/cache';

// Consuming the outer theme is only required with coexisting themes, like in this documentation.
// If your app/website doesn't deal with this, you can have just:
// const theme = createTheme({ direction: 'rtl' })
export const theme = () =>
  createTheme({
    // direction: 'rtl',
   
  });

export const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});
// export const host = 'sahara-pharma.com'
export const schema = "http";
export const host = "127.0.0.1";
// export const host = 'server1'مركز النعيم


export function blurForNoramlUsers() {
  // return classname has filter properties
  return "blurForNormalUsers";
}
// export const url = "https://intaj-starstechnology.com/jawda1/laravel-react-app/public/api/"
export const url = `${schema}://${host}/laravel-react-app/public/api/`;
//  export const url = "http://192.168.1.5/laravel-react-app/public/api/"
// export const url = "https://om-pharmacy.com/laravel-react-app/public/api/"
// export const webUrl = "https://intaj-starstechnology.com/jawda1/laravel-react-app/public/"
//  export const webUrl = "http://192.168.1.5/laravel-react-app/public/"
export const webUrl = `${schema}://${host}/laravel-react-app/public/`;
// export const webUrl = "https://om-pharmacy.com/laravel-react-app/public/"
export const notifyMe = (title, data, address, action) => {
  // alert(Notification.permission)
  if (!("Notification" in window)) {
    // Check if the browser supports notifications
    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    // Check whether notification permissions have already been granted;
    // if so, create a notification
    const notification = new Notification(title, { icon: address });
    notification.onclick = function () {
      console.log(action, "action");
      if (action) {
        // alert('ss')
        action(data);
      }
    };

    // …
  } else if (Notification.permission !== "denied") {
    // We need to ask the user for permission
    Notification.requestPermission().then((permission) => {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        const notification = new Notification(title, { icon: address });

        // …
      }
    });
  }

  // At last, if the user has denied notifications, and you
  // want to be respectful there is no need to bother them anymore.
};




export const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export function toFixed(num, fixed) {
  if (num == undefined) return 0;
  try {
    if (typeof num == "string" && isNaN(num)) {
      return 0;
    }
    var re = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
    return num.toString().match(re)[0];
  } catch (error) {
    return 0;
  }
}

export function formatNumber(number) {
  return String(number).replace(/^\d+/, (number) =>
    [...number]
      .map(
        (digit, index, digits) =>
          (!index || (digits.length - index) % 3 ? "" : ",") + digit
      )
      .join("")
  );
}
