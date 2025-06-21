import * as React from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

export default function SimpleBottomNavigation() {
  const [value, setValue] = React.useState(0);

 

  const [valuelink, setValueLink] = React.useState(0);

  const handleChangeLink = (eventlink, newValueLink) => {
    setValueLink(newValueLink);
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          bottom: 0,
          backgroundColor: "black",
        }}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          sx={{
            backgroundColor: "black",

            width: "100%",
          }}
        >
          <BottomNavigationAction
            sx={{
              // כאן מועבר הסגנון לקומפוננטת Tabs
              color: "whitesmoke", // צבע טקסט לטאבים לא פעילים
            }}
            label="Recents"
            icon={<RestoreIcon />}
          />
          <BottomNavigationAction
            sx={{
              // כאן מועבר הסגנון לקומפוננטת Tabs
              color: "whitesmoke", // צבע טקסט לטאבים לא פעילים
            }}
            label="Favorites"
            icon={<FavoriteIcon />}
          />
          <BottomNavigationAction
            sx={{
              // כאן מועבר הסגנון לקומפוננטת Tabs
              color: "whitesmoke", // צבע טקסט לטאבים לא פעילים
            }}
            label="Nearby"
            icon={<LocationOnIcon />}
          />
        </BottomNavigation>

        
      </Box>
    </>
  );
}
