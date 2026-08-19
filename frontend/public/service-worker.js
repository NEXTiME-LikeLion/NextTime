self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let data = {
    title: "NEXTiME",
    body: "버튼이 눌렸습니다.",
    url: "/main",
  };

  if (event.data) {
    try {
      data = {
        ...data,
        ...event.data.json(),
      };
    } catch (error) {
      console.error("Push payload 파싱 실패", error);
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      tag: "nextime-mqtt-button",
      renotify: true,
      data: {
        url: data.url,
      },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = new URL(
    event.notification.data?.url ?? "/main",
    self.location.origin,
  ).href;

  event.waitUntil(openOrFocusApp(targetUrl));
});

async function openOrFocusApp(targetUrl) {
  const windowClients = await clients.matchAll({
    type: "window",
    includeUncontrolled: true,
  });

  for (const client of windowClients) {
    if ("navigate" in client) {
      await client.navigate(targetUrl);
    }

    if ("focus" in client) {
      return client.focus();
    }
  }

  return clients.openWindow(targetUrl);
}
