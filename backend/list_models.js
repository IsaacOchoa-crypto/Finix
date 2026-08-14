const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyCe-S42-Ro3TFiS0Cg9aUUyz53-dhnwjPI");

async function run() {
  try {
    const fetch = require('node-fetch');
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyCe-S42-Ro3TFiS0Cg9aUUyz53-dhnwjPI`);
    const data = await response.json();
    console.log(data.models.map(m => m.name));
  } catch(e) {
    console.error(e);
  }
}
run();
