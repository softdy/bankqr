const CACHE_NAME = 'my-cache-v1'
const urlsToCache = [
    '/',
    '/index.html',
    ...[
  "/assets/ABB.png",
  "/assets/ACB.png",
  "/assets/BAB.png",
  "/assets/BIDV.png",
  "/assets/BVB.png",
  "/assets/CAKE.png",
  "/assets/CIMB.png",
  "/assets/CITIBANK.png",
  "/assets/COOPBANK.png",
  "/assets/DBS.png",
  "/assets/DOB.png",
  "/assets/EIB.png",
  "/assets/GPB.png",
  "/assets/HDB.png",
  "/assets/HLBVN.png",
  "/assets/HSBC.png",
  "/assets/IBK.png",
  "/assets/ICB.png",
  "/assets/index.4780111f.css",
  "/assets/index.616c48e4.js",
  "/assets/IVB.png",
  "/assets/KBANK.png",
  "/assets/KBHCM.png",
  "/assets/KBHN.png",
  "/assets/KEBHANAHCM.png",
  "/assets/KEBHANAHN.png",
  "/assets/KLB.png",
  "/assets/logo.a608dba9.svg",
  "/assets/LPB.png",
  "/assets/MAFC.png",
  "/assets/mb.png",
  "/assets/MSB.png",
  "/assets/NAB.png",
  "/assets/NCB.png",
  "/assets/NHB.png",
  "/assets/OCB.png",
  "/assets/OCEANBANK.png",
  "/assets/PBVN.png",
  "/assets/PGB.png",
  "/assets/PVCB.png",
  "/assets/react-venders.fdd7a765.js",
  "/assets/SCB.png",
  "/assets/SCVN.png",
  "/assets/SEAB.png",
  "/assets/SGICB.png",
  "/assets/SHB.png",
  "/assets/SHBVN.png",
  "/assets/STB.png",
  "/assets/TCB.png",
  "/assets/TIMO.png",
  "/assets/TPB.png",
  "/assets/UBANK.png",
  "/assets/UOB.png",
  "/assets/VAB.png",
  "/assets/VBA.png",
  "/assets/VBSP.png",
  "/assets/VCB.png",
  "/assets/VCCB.png",
  "/assets/VIB.png",
  "/assets/VIETBANK.png",
  "/assets/VIETTELMONEY.png",
  "/assets/VNPTMONEY.png",
  "/assets/VPB.png",
  "/assets/VRB.png",
  "/assets/WVN.png",
  "/border-1.png",
  "/index.html",
  "/logo.svg",
  "/manifest.json"
]
];

function cacheFiles(cache, urls) {
  return Promise.all(
    urls.map((url) => {
      return cache.match(url).then((cachedResponse) => {
        // Nếu đã có trong cache, không cần fetch lại
        if (cachedResponse) {
          console.log('Already cached: ' + url)
          return Promise.resolve() // Trả về Promise.resolve() nếu đã có trong cache
        }

        // Nếu chưa có, thực hiện fetch và cache
        return fetch(url)
          .then((response) => {
            if (response.ok) {
              console.log('Caching file on init: ' + url)
              return cache.add(url) // Chỉ thêm nếu response hợp lệ
            } else {
              console.error(`Failed to fetch ${url}: ${response.status}`)
            }
          })
          .catch((error) => {
            console.error(`Error fetching ${url}:`, error)
          })
      })
    }),
  )
}

// Caching các tệp trong quá trình cài đặt
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cacheFiles(cache, urlsToCache)
    }),
  )
})

// Xử lý các yêu cầu fetch với ưu tiên lấy từ cache trước
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Nếu tìm thấy trong cache, trả về ngay lập tức
      if (response) {
        return response
      }

      // Nếu không, thực hiện fetch từ mạng
      return fetch(event.request).then((networkResponse) => {
        // Kiểm tra nếu response hợp lệ
        if (networkResponse && networkResponse.status === 200) {
          return caches.open(CACHE_NAME).then((cache) => {
            // Cập nhật cache với response mới
            console.log('Caching file on fetch: ' + event.request.url)
            cache.put(event.request, networkResponse.clone())
            return networkResponse
          })
        }
        return networkResponse // Trả về response từ mạng
      })
    }),
  )
})

// Cập nhật cache khi có bản mới của Service Worker
self.addEventListener('message', (event) => {
  if (event.data.action === 'updateCache') {
    caches.open(CACHE_NAME).then((cache) => {
      return cacheFiles(cache, urlsToCache) // Cập nhật cache với các tệp cần thiết
    })
  }
})
