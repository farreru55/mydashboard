// Menunggu semua elemen halaman dimuat sebelum menjalankan kode
document.addEventListener("DOMContentLoaded", function () {
  updateClock(); // Panggil fungsi untuk mengupdate jam saat halaman dimuat
  fetchNews(); // Panggil fungsi untuk mengambil berita saat halaman dimuat

  // --- FUNGSI TO-DO LIST ---
  const todoInput = document.getElementById("todo-input");
  const addTodoBtn = document.getElementById("add-todo-btn");
  const todoList = document.getElementById("todo-list");

  // Fungsi untuk menambah tugas baru
  addTodoBtn.addEventListener("click", function () {
    const taskText = todoInput.value.trim(); // Ambil teks dan hapus spasi kosong
    if (taskText !== "") {
      const listItem = document.createElement("li");
      listItem.textContent = taskText;

      // Tambahkan event listener untuk menandai selesai saat diklik
      listItem.addEventListener("click", function () {
        listItem.classList.toggle("done");
      });

      todoList.appendChild(listItem);
      todoInput.value = ""; // Kosongkan input field
    }
  });

  // --- FUNGSI JAM DIGITAL ---
  function updateClock() {
    const clockElement = document.getElementById("clock");
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    clockElement.textContent = `${hours}:${minutes}:${seconds}`;
  }
  // Update jam setiap detik (1000 milidetik)
  setInterval(updateClock, 1000);

  // --- FUNGSI AMBIL BERITA (RSS) ---
  function fetchNews() {
    const newsContainer = document.getElementById("news-container");
    if (!newsContainer) return;

    const rssUrl = "https://rss.app/feeds/uPDYRMG2X6IVXJd7.xml"; // Ganti dengan URL RSS Anda
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
      rssUrl
    )}`;

    newsContainer.innerHTML = "<p>Memuat berita...</p>";

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          newsContainer.innerHTML = ""; // Kosongkan kontainer
          const articles = data.items.slice(0, 10);

          articles.forEach((article) => {
            const newsItem = document.createElement("div");
            newsItem.className = "news-item";

            // 1. Buat div pembungkus untuk judul dan tanggal
            const titleWrapper = document.createElement("div");
            titleWrapper.className = "title-wrapper";

            // 2. Buat link judul seperti biasa
            const articleLink = document.createElement("a");
            articleLink.href = article.link;
            articleLink.target = "_blank";
            articleLink.textContent = article.title;

            // 3. BUAT ELEMEN TANGGAL
            const dateElement = document.createElement("span");
            dateElement.className = "news-date";
            // Format tanggal agar lebih mudah dibaca (opsional)
            const pubDate = new Date(article.pubDate);
            dateElement.textContent = pubDate.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            // 4. Masukkan link judul dan elemen tanggal ke dalam pembungkusnya
            titleWrapper.appendChild(articleLink);
            titleWrapper.appendChild(dateElement);

            // ... (Kode untuk membuat imageContainer tetap sama persis)
            const imageContainer = document.createElement("div");
            imageContainer.className = "image-container";
            const imageUrl = article.thumbnail;
            if (imageUrl) {
              const image = document.createElement("img");
              image.src = imageUrl;
              image.alt = "Preview Berita";
              imageContainer.appendChild(image);
            }

            // 5. Masukkan titleWrapper dan imageContainer ke dalam item berita utama
            newsItem.appendChild(titleWrapper);
            newsItem.appendChild(imageContainer);
            newsContainer.appendChild(newsItem);
          });
        } else {
          throw new Error(data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching news:", error);
        newsContainer.innerHTML = `<p>Gagal memuat berita: ${error.message}</p>`;
      });
  }
});
