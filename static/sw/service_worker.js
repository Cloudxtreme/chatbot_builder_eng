self.addEventListener('install', () => skipWaiting());

self.addEventListener('activate', () => clients.claim());

self.addEventListener('push', event => {
	event.waitUntil(registration.showNotification("Title", { body: "Text" }));
});

self.addEventListener('notificationclick', event => {
	event.notification.close();
	event.waitUntil(clients.matchAll().then(cs => {
		for (var client of cs) {
			if (client.url == registration.scope)
				return client.focus();
		}
		return clients.openWindow(registration.scope);
	}));
});
