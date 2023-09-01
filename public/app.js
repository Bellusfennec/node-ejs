const TITLE_KEY = "old-title";

document.addEventListener("click", (event) => {
  const { type, id } = event.target.dataset;
  if (type === "remove") {
    remove(id).then(() => {
      event.target.closest("li").remove();
    });
  }
  if (type === "update") {
    const li = event.target.closest("li");
    const oldTitle = li.firstElementChild.textContent;
    localStorage.setItem(TITLE_KEY, oldTitle);
    li.firstElementChild.innerHTML = `<input type="text" name="title" class="form-control" required value="${oldTitle}">`;
    li.lastElementChild.innerHTML = `
    <div class="d-flex gap-2">
    <button class="btn btn-success" data-type="save" data-id="${id}">Сохранить</button>
    <button class="btn btn-danger" data-type="cancel" data-id="${id}">Отменить</button>
    </div>
    `;
  }
  if (type === "cancel" || type === "save") {
    const li = event.target.closest("li");
    const oldTitle = localStorage.getItem(TITLE_KEY);
    const title = li.firstElementChild.firstElementChild.value;

    if (type === "save") {
      update({ id, title })
        .then(() => {
          li.firstElementChild.textContent = title;
        })
        .catch(() => {
          li.firstElementChild.textContent = oldTitle;
        });
    } else {
      li.firstElementChild.textContent = oldTitle;
    }
    li.lastElementChild.innerHTML = `
    <div class="d-flex gap-2">
    <button class="btn btn-primary" data-type="update" data-id="${id}">Обновить</button>
    <button class="btn btn-danger" data-type="remove" data-id="${id}">&times;</button>
    </div>
    `;
    localStorage.removeItem(TITLE_KEY);
  }
});

async function remove(id) {
  await fetch(`/${id}`, { method: "DELETE" });
}
async function update({ id, title }) {
  await fetch("/", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({ id, title }),
  });
}
