# 🥗 Diet Recommendation System

[![Made with ❤️ by Suraj Jaiswar](https://img.shields.io/badge/Made%20with%20%E2%9D%A4%EF%B8%8F%20by-Suraj%20Jaiswar-blueviolet)](https://www.linkedin.com/in/suraj-jaiswar-7007251b6/)
[![GitHub stars](https://img.shields.io/github/stars/surajjaiswar2003/Diet-Recommendation-System?style=social)](https://github.com/surajjaiswar2003/Diet-Recommendation-System/stargazers)
[![License](https://img.shields.io/github/license/surajjaiswar2003/Diet-Recommendation-System)](LICENSE)

A smart **Diet Planner** that uses **Machine Learning** to generate personalized diet plans and recipes based on 40+ health, lifestyle, and dietary parameters extracted from your health report.

---

## 🧠 Features

- 📄 Upload health reports (PDF) for smart parameter extraction
- 🧬 Personalized diet plans based on 40+ parameters
- 🥘 AI-generated meal suggestions & recipes
- ⚡ Modern, responsive UI with interactive visuals
- 📊 Visualization of key health metrics
- 🧾 Export your diet plan as PDF

---

## 🚀 Tech Stack

| Frontend        | Backend         | ML/AI            | Others              |
|-----------------|-----------------|------------------|----------------------|
| HTML, Tailwind  | Flask / FastAPI | Scikit-learn     | Python, OCR, Tesseract |
| JavaScript      | Python          | Pandas, NumPy    | PDF Parsing, Chart.js |

---

## 📸 Screenshots

![upload](https://github.com/surajjaiswar2003/My_Diet_Diary/blob/main/UI_Frontend/Screenshot%202025-04-30%20113226.png)

| AI Diet Plan 🥗 | Report 🧾 |
|------------------|----------------|
| ![upload](https://github.com/surajjaiswar2003/My_Diet_Diary/blob/main/UI_Frontend/Screenshot%202025-05-11%20083716.png) | ![result](https://github.com/surajjaiswar2003/My_Diet_Diary/blob/main/UI_Frontend/Screenshot%202025-05-11%20083615.png) |

---

## 🛠️ Installation & Setup

### 🔁 Clone the Repository

```bash
git clone https://github.com/surajjaiswar2003/BlueMedix-Project-SDRMH482736-.git
cd BlueMedix-Project-SDRMH482736-

---

### ⚙️ Python Environment & Flask Server

1. Install Python 3.10+ from [python.org](https://www.python.org/downloads/)

2. Create a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```

3. Install Python dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Run Flask backend:

   ```bash
   cd ML
   python app.py
   # App will run on http://localhost:5001
   ```

---

### ⚙️ Node.js Backend Setup

1. Install Node.js from [nodejs.org](https://nodejs.org/en/download)

2. Setup backend:

   ```bash
   cd backend
   npm install express mongoose cors dotenv
   npm install csv-parser
   sudo npm install -g nodemon
   npm run dev
   # Server runs on http://localhost:5000
   ```

---

### ⚙️ Frontend Setup

1. Navigate to frontend folder:

   ```bash
   cd UI_Frontend
   ```

2. Install frontend dependencies:

   ```bash
   npm install
   npm install vite --save-dev
   ```

3. Start the frontend:

   ```bash
   npm run dev
   # Opens app at http://localhost:8080
   ```

---

### 🧠 Machine Learning Model (2 Options)

#### Option 1: Google Colab

* Open Colab and upload `Diet_plan_generation_model.ipynb` from the `ML` folder.
* Upload these CSVs from `ML/data`:
  `train_user_parameters.csv`, `test_user_parameters.csv`, `recipes_modified.csv`
* ⚠️ Remove all `"data/"` prefixes from paths in the notebook.

#### Option 2: Run Locally via Jupyter Notebook

```bash
pip install notebook numpy pandas matplotlib seaborn scikit-learn
cd ML
jupyter notebook
```

Open `Diet_plan_generation_model.ipynb` and run.

---

### 🛢️ MongoDB Setup

1. Install MongoDB Compass: [Download Compass](https://www.mongodb.com/products/tools/compass)

2. Connect to local database:

   * URI: `mongodb://localhost:27017/mydietdiary`
   * Database: `mydietdiary`

3. Create collections and explore data as it’s populated via the app.

---

### 🔑 Admin Login

* URL: `http://localhost:8080/admin/login`
* **Email**: `admin@email.com`
* **Password**: `admin123pasword` *(one 's')*

---

## 📁 Project Structure

```
BlueMedix-Project-SDRMH482736-/
│
├── ML/
│   ├── data/
│   ├── Dataset_Generation/
│   ├── models/
│   ├── app.py
│   └── Diet_plan_generation_model.ipynb
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── UI_Frontend/
│   ├── src/
│       ├── components/
│       └── pages/
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to open an issue or submit a pull request.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🔗 Connect with Me

**Suraj Jaiswar**
[LinkedIn](https://www.linkedin.com/in/suraj-jaiswar-7007251b6/)
[GitHub](https://github.com/Suraj-Jaiswar)
[Email](mailto:jaiswarsuraj2003@gmail.com)

---

```

Would you like this saved as a downloadable `README.md` file or should I help you push it to your GitHub repo directly?
```
