self.addEventListener("install", (event) => {
  console.log("[NEXTiME][SW] install", {
    scriptURL: self.location.href,
  });
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  console.log("[NEXTiME][SW] activate");
  event.waitUntil(
    self.clients.claim().then(() => {
      console.log("[NEXTiME][SW] clients.claim 완료");
    }),
  );
});

self.addEventListener("push", (event) => {
  console.log("[NEXTiME][SW] push 수신", {
    hasData: Boolean(event.data),
  });

  let data = {
    title: "NEXTiME",
    body: "버튼이 눌렸습니다.",
    url: "/next-time",
  };

  if (event.data) {
    try {
      const rawText = event.data.text();
      console.log("[NEXTiME][SW] push raw text", rawText);
      data = {
        ...data,
        ...JSON.parse(rawText),
        url: "/next-time",
      };
      console.log("[NEXTiME][SW] push payload", data);
    } catch (error) {
      console.error("[NEXTiME][SW] Push payload 파싱 실패", error);
    }
  }

  event.waitUntil(
    self.registration
      .showNotification(data.title, {
        body: data.body,
        icon: "/icons/icon-192.png",
        badge: "/icons/icon-192.png",
        tag: "nextime-mqtt-button",
        renotify: true,
        data: {
          url: data.url,
        },
      })
      .then(() => {
        console.log("[NEXTiME][SW] showNotification 완료", data);
      })
      .catch((error) => {
        console.error("[NEXTiME][SW] showNotification 실패", error);
      }),
  );
});

self.addEventListener("notificationclick", (event) => {
  console.log("[NEXTiME][SW] notificationclick", {
    action: event.action,
    data: event.notification.data,
  });
  event.notification.close();

  const targetUrl = new URL(
    event.notification.data?.url ?? "/next-time",
    self.location.origin,
  ).href;

  event.waitUntil(openOrFocusApp(targetUrl));
});

async function openOrFocusApp(targetUrl) {
  console.log("[NEXTiME][SW] openOrFocusApp", { targetUrl });
  const windowClients = await clients.matchAll({
    type: "window",
    includeUncontrolled: true,
  });
  console.log("[NEXTiME][SW] 열린 창 수", windowClients.length);

  for (const client of windowClients) {
    console.log("[NEXTiME][SW] 기존 창", {
      url: client.url,
      focused: client.focused,
      visibilityState: client.visibilityState,
    });
    if ("navigate" in client) {
      await client.navigate(targetUrl);
      console.log("[NEXTiME][SW] navigate 완료", targetUrl);
    }

    if ("focus" in client) {
      const focused = await client.focus();
      console.log("[NEXTiME][SW] focus 완료");
      return focused;
    }
  }

  console.log("[NEXTiME][SW] 새 창 열기", targetUrl);
  return clients.openWindow(targetUrl);
}
