// seed-tasks.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

async function seedTasks() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Conectado ao MongoDB");

    const db = client.db();
    const tasksCollection = db.collection("tasks");

    const today = new Date();
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today); nextWeek.setDate(nextWeek.getDate() + 7);
    const nextMonth = new Date(today); nextMonth.setMonth(nextMonth.getMonth() + 1);
    const lastWeek = new Date(today); lastWeek.setDate(lastWeek.getDate() - 7);

    const tasks = [
      {
        name: "Tarefa 1",
        title: "Organização Geral",
        notes: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        sector: "Esportes",
        dueDate: today,
        responsible: "Sr. Responsável 1",
        status: "active",
        createdAt: today
      },
      {
        name: "Tarefa 2",
        title: "Revisão de Evento",
        notes: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
        sector: "Eventos",
        dueDate: yesterday,
        responsible: "Sr. Responsável 2",
        status: "expired",
        createdAt: lastWeek
      },
      {
        name: "Tarefa 3",
        title: "Controle Financeiro",
        notes: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        sector: "Financeiro",
        dueDate: tomorrow,
        responsible: "Sr. Responsável 3",
        status: "active",
        createdAt: today
      },
      {
        name: "Tarefa 4",
        title: "Campanha de Divulgação",
        notes: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
        sector: "Marketing",
        dueDate: nextWeek,
        responsible: "Sr. Responsável 4",
        status: "active",
        createdAt: today
      },
      {
        name: "Tarefa 5",
        title: "Produção de Materiais",
        notes: "Excepteur sint occaecat cupidatat non proident, sunt in culpa.",
        sector: "Produtos",
        dueDate: nextMonth,
        responsible: "Sr. Responsável 5",
        status: "active",
        createdAt: today
      },
      {
        name: "Tarefa 6",
        title: "Organizar Documentação",
        notes: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        sector: "Outros",
        dueDate: lastWeek,
        status: "completed",
        createdAt: lastWeek
      },
      {
        name: "Tarefa 7",
        title: "Reserva de Espaço Esportivo",
        notes: "Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
        sector: "Esportes",
        dueDate: tomorrow,
        responsible: "Sr. Responsável 1",
        status: "active",
        createdAt: today
      },
      {
        name: "Tarefa 8",
        title: "Planejamento de Evento",
        notes: "Sed do eiusmod tempor incididunt ut labore et dolore magna.",
        sector: "Eventos",
        dueDate: nextMonth,
        responsible: "Sr. Responsável 2",
        status: "active",
        createdAt: today
      },
      {
        name: "Tarefa 9",
        title: "Apresentação de Resultados",
        notes: "Duis aute irure dolor in reprehenderit in voluptate velit esse.",
        sector: "Financeiro",
        dueDate: yesterday,
        responsible: "Sr. Responsável 3",
        status: "expired",
        createdAt: lastWeek
      },
      {
        name: "Tarefa 10",
        title: "Atualização de Conteúdo",
        notes: "Excepteur sint occaecat cupidatat non proident.",
        sector: "Marketing",
        dueDate: today,
        responsible: "Sr. Responsável 4",
        status: "completed",
        createdAt: today
      }
    ];

    const result = await tasksCollection.insertMany(tasks);
    console.log(`${result.insertedCount} tarefas foram inseridas com sucesso!`);
    Object.values(result.insertedIds).forEach(id => console.log(id.toString()));

  } catch (error) {
    console.error("Erro ao inserir tarefas:", error);
  } finally {
    await client.close();
    console.log("Conexão com o MongoDB fechada");
  }
}

seedTasks().catch(console.error);
