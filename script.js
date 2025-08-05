// Menunggu semua elemen halaman dimuat sebelum menjalankan kode
document.addEventListener("DOMContentLoaded", function () {
  updateClock(); // Panggil fungsi untuk mengupdate jam saat halaman dimuat

  // --- FUNGSI BARU: AMBIL TUGAS MELALUI PROXY SERVERLESS ---
  function fetchTodoistTasks() {
    const todoListContainer = document.getElementById("todo-list");
    if (!todoListContainer) return;

    // URL ini menuju ke serverless function kita, bukan ke Todoist lagi
    const proxyUrl = "/api/getTodoistTasks";

    todoListContainer.innerHTML = "<li>Memuat tugas...</li>";

    fetch(proxyUrl)
      .then((response) => {
        if (!response.ok) {
          // Tangkap error dari serverless function jika ada
          return response.json().then((err) => {
            throw new Error(err.error || "Respon jaringan tidak baik.");
          });
        }
        return response.json();
      })
      .then((tasks) => {
        todoListContainer.innerHTML = "";
        if (tasks.length === 0) {
          todoListContainer.innerHTML = "<li>Tidak ada tugas aktif.</li>";
        } else {
          tasks.forEach((task) => {
            const listItem = document.createElement("li");
            listItem.textContent = task.content;
            todoListContainer.appendChild(listItem);
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching via proxy:", error);
        todoListContainer.innerHTML = `<li>Gagal memuat: ${error.message}</li>`;
      });
  }

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
  const newsContainer = document.getElementById("news-container");

  // Ganti URL ini dengan RSS feed dari situs berita yang Anda inginkan
  // Contoh ini menggunakan ANTARA News (Politik)
  const rssUrl = "https://www.antaranews.com/rss/politik.xml";

  // Kita gunakan layanan rss2json untuk mengubah RSS menjadi format JSON
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
    rssUrl
  )}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "ok") {
        newsContainer.innerHTML = ""; // Kosongkan pesan "Memuat berita..."
        const articles = data.items.slice(0, 10); // Ambil 10 berita teratas
        articles.forEach((article) => {
          const articleLink = document.createElement("a");
          articleLink.href = article.link;
          articleLink.target = "_blank"; // Buka di tab baru
          articleLink.textContent = article.title;
          newsContainer.appendChild(articleLink);
        });
      } else {
        newsContainer.innerHTML = "Gagal memuat berita.";
      }
    })
    .catch((error) => {
      console.error("Error fetching news:", error);
      newsContainer.innerHTML = "Terjadi kesalahan saat mengambil berita.";
    });
});
