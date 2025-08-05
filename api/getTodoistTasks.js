// api/getTodoistTasks.js

export default async function handler(req, res) {
    // Ambil API Token & Project ID dari Environment Variables yang aman
    const apiToken = process.env.TODOIST_API_TOKEN;
    const projectId = process.env.TODOIST_PROJECT_ID;

    if (!apiToken || !projectId) {
        return res.status(500).json({ error: 'API Token atau Project ID tidak diatur di server.' });
    }

    const apiUrl = `https://api.todoist.com/rest/v2/tasks?project_id=${projectId}`;

    try {
        const fetch = (await import('node-fetch')).default;
        
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${apiToken}` }
        });

        if (!response.ok) {
            throw new Error('Gagal mengambil data dari Todoist.');
        }

        const tasks = await response.json();
        
        // Kirim data yang berhasil didapat sebagai response
        res.status(200).json(tasks);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}