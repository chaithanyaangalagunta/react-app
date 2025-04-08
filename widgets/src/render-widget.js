import React, { useEffect, useState } from "react";
import { NewsletterSignup } from "./news-letter";
import { ChartExample } from "./chart";
import {
  Button,
  Card,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
export function RenderWidget({ context, app }) {
  const queryParams = new URLSearchParams(window.location.search);
  const identifier = queryParams.get("widgetId");
  console.log({ context, app, identifier });
  console.log({ identifier });
  switch (identifier) {
    case "accounts-tab-sample-widget":
      return <AccountsTab context={context} app={app} />;
    case "projects-tab-sample-widget":
      return <ProjectsTab context={context} app={app} />;
    case "location-widget":
      return <IpifyWidget context={context} app={app} />;
    default:
      return <div>Error 404</div>;
  }
}

function IpifyWidget({ context, app }) {
  const [type, setType] = useState("");
  const [ip, setIp] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [location, setLocation] = useState(null);
  const [style, setStyle] = useState({});

  const onFetchIp = () => {
    setLoading(true);
    app.data
      .invoke("getMyIp", { type: type })
      .then((d) => {
        console.log("Fetched ip", d);
        setIp(d?.response?.ip);
      })
      .catch((e) => {
        console.log({ e });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onGetLocation = () => {
    setFetchingLocation(true);
    app.data
      .invoke("getMyLocation", { ipAddress: ip })
      .then((d) => {
        console.log("Fetched location", d);
        setLocation(d?.response);
      })
      .catch((e) => {
        console.log({ e });
      })
      .finally(() => {
        setFetchingLocation(false);
      });
  };

  useEffect(() => {
    console.log("app.events.enum.CUSTOMER_PORTAL_WIDGET_DATA_UPDATE", app.events.enums);
    if(app.events.enums.CUSTOMER_PORTAL_WIDGET_DATA_UPDATE) {
    console.log("CUSTOMER_PORTAL_WIDGET_DATA_UPDATE", app.events.enums.CUSTOMER_PORTAL_WIDGET_DATA_UPDATE);
      const listener = (data) => {
        console.log("Customer portal widget data updated", data);
        const t = data?.data?.buildInput?.type;
        console.log("t", t);
        if (data?.data?.styles) {
          setStyle(data?.data?.styles);
        }
        if (t) {
          setType(t);
        }
      };
    app.events.on(
      app.events.enums.CUSTOMER_PORTAL_WIDGET_DATA_UPDATE,
      listener
    );

    return () => {
      app.events.off(
        app.events.enums.CUSTOMER_PORTAL_WIDGET_DATA_UPDATE,
        listener
      );
    };
  }
  }, [app]);

  return (
    <>
      <style>
        {`
      :root {
        --primary-color: ${style?.background};
      }
      `}
      </style>
      <Button
        onClick={async () => {
          const result = await app.interface.show("dialog", {
            title: "Hello",
            content: "World",
          });
          console.log({ result });
        }}
      >
        Show modal
      </Button>
      <br />
      <br />
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Ipv4/Ipv6</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={type}
          label="Age"
          onChange={(e) => setType(e?.target?.value)}
        >
          <MenuItem value={"v4"}>IpV4</MenuItem>
          <MenuItem value={"v6"}>IpV6</MenuItem>
        </Select>

        <Button loading={loading} onClick={onFetchIp}>
          Fetch my Ip
        </Button>
        {
          ip ? (
            <Input
              value={ip}
              disabled
              fullWidth
              style={{ marginTop: "10px" }}
            />
          ) : (
            <></>
          ) // eslint-disable-line
        }
        <br />
        <br />
        <br />
        {location ? (
          <>
            <p>
              City : {location?.cityName}, Country : {location?.countryName}
            </p>
          </>
        ) : (
          <></>
        )}
        <Button loading={fetchingLocation} onClick={onGetLocation}>
          Get my location
        </Button>
      </FormControl>
    </>
  );
}

function AccountsTab({ context, app }) {
  return <div>Hello World</div>;
}

const fullName = (user) => {
  if (!user) return "";
  return `${user.firstName} ${user.lastName}`;
};

function ProjectsTab({ context, app }) {
  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState(null);
  const [userFromJsonPlaceholder, setUserFromJsonPlaceholder] = useState(null);
  const [pl, setPl] = useState(false);

  const onClick = () => {
    setPl(true);
    app.data
      .invoke?.("onSampleServerAction", { chaithu: "moni" })
      ?.then?.((d) => {
        console.log(d);
        setUserFromJsonPlaceholder(d?.response);
      })
      ?.catch?.((e) => {
        console.log({ e });
      })
      ?.finally?.(() => {
        setPl(false);
      });
  };

  useEffect(() => {
    if (!loaded) {
      app.data
        .get(app.data.dataIdentifiers.GET_USER_DATA)
        .then((u) => {
          setUser(u);
          setLoaded(true);
        })
        .catch((e) => {
          console.log("Error", e);
        });
    }
  }, [app, loaded]);

  if (!loaded) {
    return (
      <Card sx={{ maxWidth: 345 }} className="loading-wrapper">
        <Skeleton />
        <Skeleton animation="wave" />
        <Skeleton animation={false} />
      </Card>
    );
  }

  return (
    <div>
      <p>
        {user?.firstName + " " + user?.lastName ?? "No user data"}
      </p>
      {userFromJsonPlaceholder ? (
        <>
          <p>{userFromJsonPlaceholder?.title}</p>
        </>
      ) : (
        <></>
      )}
      {user ? (
        <>
          <Button onClick={onClick} loading={pl}>
            {userFromJsonPlaceholder?.title ?? "Fetch Data"}
          </Button>
          {/* <NewsletterSignup user={user} /> */}
          <ChartExample />
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
