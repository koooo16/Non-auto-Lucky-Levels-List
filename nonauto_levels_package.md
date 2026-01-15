I can create a full folder structure with all files prefilled for your Non-Auto Levels List project. Since I can't generate a downloadable zip directly, I will provide the complete content for all the files so you can copy them into a folder and deploy.

---

# Folder Structure
```
NonAutoLevels_Deployment/
├── pages/
│   ├── index.html
│   ├── list.html
│   ├── submit.html
│   ├── moderator.html
│   ├── dashboard.html
│   ├── style.css
│   └── modal.js
├── worker/
│   ├── worker.js
│   └── wrangler.toml
├── levels.json
└── README.md
```

---

# Pages Files

### index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Non-Auto Levels List</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
<header>
  <h1>Non-Auto Levels List</h1>
  <nav>
    <a href="index.html">Home</a>
    <a href="list.html">List</a>
    <a href="submit.html">Submit</a>
    <a href="moderator.html">Moderator</a>
  </nav>
</header>
<main>
  <section>
    <h2>About</h2>
    <p>Community-maintained list of Non-Auto Geometry Dash levels.</p>
  </section>
</main>
</body>
</html>
```

### list.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Non-Auto Levels List</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
<header>
  <h1>Non-Auto Levels List</h1>
  <nav>
    <a href="index.html">Home</a>
    <a href="list.html">List</a>
    <a href="submit.html">Submit</a>
  </nav>
</header>
<main>
  <h2>Levels</h2>
  <ul id="level-list"></ul>
</main>
<script>
fetch('levels.json')
  .then(res => res.json())
  .then(levels => {
    const list = document.getElementById('level-list');
    levels.forEach(level => {
      const li = document.createElement('li');
      li.innerHTML = `<b>${level.name}</b> - Creator: ${level.creator} - Submitted by: ${level.submitter}`;
      list.appendChild(li);
    });
  });
</script>
</body>
</html>
```

### submit.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Submit a Level</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
<header>
  <h1>Submit a Non-Auto Level</h1>
  <nav>
    <a href="index.html">Home</a>
    <a href="list.html">List</a>
  </nav>
</header>
<main>
  <button id="openModal">Submit a Level</button>
  <div id="modal" class="modal">
    <div class="modal-content">
      <span id="closeModal" class="close">&times;</span>
      <h2>Submit Level</h2>
      <form>
        <label>Level Name<input type="text" required></label>
        <label>Refresh Rate<input type="number" placeholder="60 / 144 / 240" required></label>
        <label>Trigger Chances<input type="text" placeholder="1 in 5 per attempt" required></label>
        <label>Approx Time to Beat<input type="text" placeholder="e.g., 45s" required></label>
        <label>How rare is it?<input type="text" placeholder="1 out of ???" required></label>
        <button type="submit">Submit</button>
      </form>
    </div>
  </div>
</main>
<script src="modal.js"></script>
</body>
</html>
```

### moderator.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Moderator Login</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
<h1>Moderator Access</h1>
<input id="modId" placeholder="Enter Moderator ID">
<button onclick="login()">Enter</button>
<p id="status"></p>
<script>
async function login() {
  const modId = document.getElementById("modId").value;
  const res = await fetch("https://YOUR-WORKER-URL/auth", {
    method: "POST",
    body: JSON.stringify({ modId })
  });
  const data = await res.json();
  if(data.authorized){
    localStorage.setItem("modAuth","true");
    location.href="dashboard.html";
  } else {
    document.getElementById("status").textContent = "Access denied";
  }
}
</script>
</body>
</html>
```

### dashboard.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Moderation Dashboard</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
<h1>Moderation Menu</h1>
<button onclick="loadSubmissions()">View Level Submissions</button>
<button onclick="loadLogs()">View Completions & Verifications</button>
<pre id="output"></pre>
<script>
if(!localStorage.getItem("modAuth")) location.href="moderator.html";
async function loadSubmissions(){
  const res = await fetch("https://YOUR-WORKER-URL/submissions");
  document.getElementById("output").textContent = JSON.stringify(await res.json(), null, 2);
}
async function loadLogs(){
  const res = await fetch("https://YOUR-WORKER-URL/logs");
  document.getElementById("output").textContent = JSON.stringify(await res.json(), null, 2);
}
</script>
</body>
</html>
```

### style.css
```css
body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
header { background: #222; color: #fff; padding: 10px; }
nav a { margin: 0 10px; color: #fff; text-decoration: none; }
main { padding: 20px; }
.modal { display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); }
.modal-content { background:#fff; margin:10% auto; padding:20px; width:300px; position:relative; }
.close { position:absolute; top:10px; right:15px; cursor:pointer; }
button { padding:5px 10px; cursor:pointer; }
```

### modal.js
```js
const modal = document.getElementById("modal");
const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");
openBtn.onclick = () => { modal.style.display="block"; };
closeBtn.onclick = () => { modal.style.display="none"; };
window.onclick = (e) => { if(e.target===modal) modal.style.display="none"; };
```

---

# Worker Files

### worker.js
```js
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if(url.pathname=="/auth"){
      const { modId } = await request.json();
      const valid = await env.MODERATOR_IDS.get(modId);
      return new Response(JSON.stringify({authorized: !!valid}), {headers: {"Content-Type":"application/json"}});
    }
    if(url.pathname=="/submissions"){
      const list = await env.LEVEL_SUBMISSIONS.list();
      const data=[];
      for(const key of list.keys){
        data.push(await env.LEVEL_SUBMISSIONS.get(key.name, "json"));
      }
      return Response.json(data);
    }
    if(url.pathname=="/logs"){
      const list = await env.LEVEL_LOGS.list();
      const data=[];
      for(const key of list.keys){
        data.push(await env.LEVEL_LOGS.get(key.name, "json"));
      }
      return Response.json(data);
    }
    return new Response("Not Found",{status:404});
  }
};
```

### wrangler.toml
```toml
name = "nonauto-levels-worker"
compatibility_date = "2026-01-15"
[env.production]
account_id = "YOUR_CLOUDFLARE_ACCOUNT_ID"
workers_dev = true
route = ""
zone_id = ""
```

---

# levels.json
```json
[
  {"name": "Lucky Draw", "creator": "PlayerOne", "submitter": "User123"},
  {"name": "RNG Madness", "creator": "ChaosDev", "submitter": "User456"}
]
```

---

# README.md
```
# Deployment Instructions

## 1. Frontend (Cloudflare Pages)
- Connect the `pages/` folder to Cloudflare Pages
- Framework preset: None
- Build command: empty
- Output directory: `/`
- Deploy

## 2. Worker Deployment
- In `worker/` folder, run: `npx wrangler deploy`
- Bind KV namespaces: `MODERATOR_IDS`, `LEVEL_SUBMISSIONS`, `LEVEL_LOGS`

## 3. KV Setup
- Workers → KV → Create namespaces
- Add moderator IDs (long, uppercase, alphanumeric) to `MODERATOR_IDS`
- Submissions and logs will go to respective namespaces

## 4. Testing
- Open Pages site for frontend
- Moderator login: `moderator.html`
- Dashboard reads KV and submissions
```

