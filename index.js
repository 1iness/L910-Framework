const Application = require('./src/framework/Application');
const Router = require('./src/framework/Router');
const { readData, writeData } = require('./src/data-helper');
const crypto = require('crypto');

const PORT = 5000;
const app = new Application();
const router = new Router();

app.use((req, res) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
});

const setupCrudRoutes = (resourceName, fileName) => {
    const path = `/${resourceName}`;

    router.get(path, async (req, res) => {
        const data = await readData(fileName);
        res.json(data[resourceName]);
    });

    router.get(`${path}/:id`, async (req, res) => {
        const data = await readData(fileName);
        const item = data[resourceName].find(i => i.id === req.params.id);
        item ? res.json(item) : res.status(404).json({ message: "Не найдено" });
    });

    router.post(path, async (req, res) => {
        const data = await readData(fileName);
        const newItem = { ...req.body, id: crypto.randomUUID() };
        data[resourceName].push(newItem);
        await writeData(fileName, data);
        res.status(201).json(newItem);
    });

    router.put(`${path}/:id`, async (req, res) => {
        const data = await readData(fileName);
        const index = data[resourceName].findIndex(i => i.id === req.params.id);
        if (index !== -1) {
            data[resourceName][index] = { ...req.body, id: req.params.id };
            await writeData(fileName, data);
            res.json(data[resourceName][index]);
        } else {
            res.status(404).json({ message: "Не найдено" });
        }
    });

    router.patch(`${path}/:id`, async (req, res) => {
        const data = await readData(fileName);
        const index = data[resourceName].findIndex(i => i.id === req.params.id);
        if (index !== -1) {
            data[resourceName][index] = { ...data[resourceName][index], ...req.body };
            await writeData(fileName, data);
            res.json(data[resourceName][index]);
        } else {
            res.status(404).json({ message: "Не найдено" });
        }
    });

    router.delete(`${path}/:id`, async (req, res) => {
        const data = await readData(fileName);
        const initialLength = data[resourceName].length;
        data[resourceName] = data[resourceName].filter(i => i.id !== req.params.id);
        
        if (data[resourceName].length !== initialLength) {
            await writeData(fileName, data);
            res.json({ message: "Удален успешно" });
        } else {
            res.status(404).json({ message: "Не найдено" });
        }
    });
};

setupCrudRoutes('medicines', 'medicines.json');
setupCrudRoutes('pharmacists', 'pharmacists.json');

app.addRouter(router);

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});