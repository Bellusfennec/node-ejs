const fs = require("fs/promises");
const path = require("path");
const chalk = require("chalk");

const notesPath = path.join(__dirname, "db.json");

async function addNote(title) {
  const notes = await getNotes();
  const note = {
    title,
    id: Date.now().toString(),
  };

  notes.push(note);

  await fs.writeFile(notesPath, JSON.stringify(notes));
  console.log(chalk.bgGreen(`A note titled '${title}' has been added!`));
}

async function removeNote(id) {
  const notes = await getNotes();
  const newNotes = notes.filter((n) => n.id !== id);

  await fs.writeFile(notesPath, JSON.stringify(newNotes));
  console.log(chalk.bgRed(`Note with '${id}' has been deleted!`));
}

async function updateNote({ id, title }) {
  const notes = await getNotes();
  const index = notes.findIndex((n) => n.id === id);
  notes[index] = { ...notes[index], title };

  await fs.writeFile(notesPath, JSON.stringify(notes));
  console.log(
    chalk.bgBlue(`Note with '${id}' has been changed titled '${title}'!`)
  );
}

async function getNotes() {
  const notes = await fs.readFile(notesPath, { encoding: "utf-8" });
  return Array.isArray(JSON.parse(notes)) ? JSON.parse(notes) : [];
}

async function printNote() {
  const notes = await getNotes();

  console.log(chalk.bgBlue("Here is the list of notes:"));
  notes.forEach((note) => {
    console.log(note.id, chalk.blue(note.title));
  });
}

module.exports = {
  addNote,
  printNote,
  removeNote,
  getNotes,
  updateNote,
};
