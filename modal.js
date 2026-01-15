const modal = document.getElementById("modal");
const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");
openBtn.onclick = () => { modal.style.display="block"; };
closeBtn.onclick = () => { modal.style.display="none"; };
window.onclick = (e) => { if(e.target===modal) modal.style.display="none"; };
