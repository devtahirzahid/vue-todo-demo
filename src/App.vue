<template>
  <div id="app">
    <div class="todo-container">
      <h2>To do ({{ activeTodos.length }})</h2>
      <div class="input-row">
        <input
          type="text"
          v-model="newTodo"
          @keyup.enter="addTodo"
          placeholder="Add a new task and press ENTER"
        />
        <button @click="addTodo" :disabled="!newTodo.trim()">Add</button>
      </div>
      <draggable
        :list="activeTodos"
        group="todos"
        item-key="text"
        class="todo-list"
        ghost-class="drag-ghost"
        chosen-class="drag-chosen"
        animation="200"
        @change="onMovedToActive"
        @end="onSort"
      >
        <template #item="{ element }">
          <li class="todo-item">
            <label>
              <input
                type="checkbox"
                :checked="element.completed"
                @change="toggleTodo(element)"
              />
              <span>{{ element.text }}</span>
            </label>
            <button class="remove" @click="removeTodo(element)">✕</button>
            <span class="drag-handle" title="Drag to reorder">⠿</span>
          </li>
        </template>
      </draggable>
    </div>

    <div class="todo-container completed">
      <h2>Completed ({{ completedTodos.length }})</h2>
      <draggable
        :list="completedTodos"
        group="todos"
        item-key="text"
        class="todo-list"
        ghost-class="drag-ghost"
        chosen-class="drag-chosen"
        animation="200"
        @change="onMovedToCompleted"
        @end="onSort"
      >
        <template #item="{ element }">
          <li class="todo-item completed">
            <label>
              <input
                type="checkbox"
                :checked="element.completed"
                @change="toggleTodo(element)"
              />
              <span
                ><del>{{ element.text }}</del></span
              >
            </label>
            <button class="remove" @click="removeTodo(element)">✕</button>
            <span class="drag-handle" title="Drag to reorder">⠿</span>
          </li>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import draggable from "vuedraggable";
import { toast } from "vue3-toastify";

const todos = ref([]);

onMounted(() => {
  const saved = localStorage.getItem("todos");
  if (saved) {
    try {
      todos.value = JSON.parse(saved);
      // Ensure all todos have order properties
      todos.value = todos.value.map((todo, index) => ({
        ...todo,
        activeOrder: todo.activeOrder ?? (todo.completed ? -1 : index),
        completedOrder: todo.completedOrder ?? (todo.completed ? index : -1),
      }));
    } catch {
      todos.value = [];
    }
  } else {
    todos.value = [
      {
        text: "Send job application",
        completed: true,
        activeOrder: -1,
        completedOrder: 0,
      },
      {
        text: "Learn about Vue",
        completed: false,
        activeOrder: 0,
        completedOrder: -1,
      },
      {
        text: "Learn about Fliplet",
        completed: false,
        activeOrder: 1,
        completedOrder: -1,
      },
      {
        text: "Play around in JSFiddle",
        completed: false,
        activeOrder: 2,
        completedOrder: -1,
      },
      {
        text: "Show us what you've got",
        completed: false,
        activeOrder: 3,
        completedOrder: -1,
      },
    ];
  }
});

watch(
  todos,
  (newVal) => {
    localStorage.setItem("todos", JSON.stringify(newVal));
  },
  { deep: true }
);

const newTodo = ref("");

const activeTodos = computed(() =>
  todos.value
    .filter((todo) => !todo.completed)
    .sort((a, b) => a.activeOrder - b.activeOrder)
);
const completedTodos = computed(() =>
  todos.value
    .filter((todo) => todo.completed)
    .sort((a, b) => a.completedOrder - b.completedOrder)
);

function addTodo() {
  const trimmed = newTodo.value.trim();
  if (!trimmed) return;

  const exists = todos.value.some(
    (t) => t.text.toLowerCase() === trimmed.toLowerCase()
  );
  if (exists) {
    toast.warning("Task already exists!", { autoClose: 1800 });
    return;
  }

  const activeCount = todos.value.filter((t) => !t.completed).length;
  todos.value.push({
    text: trimmed,
    completed: false,
    activeOrder: activeCount,
    completedOrder: -1,
  });
  toast.success("Task added!", { autoClose: 1800 });
  newTodo.value = "";
}

function toggleTodo(todo) {
  todo.completed = !todo.completed;
  if (todo.completed) {
    toast.info("Task marked as completed!", { autoClose: 1800 });
  } else {
    toast("Task moved to active!", { autoClose: 1800 });
  }
}

function removeTodo(todo) {
  const idx = todos.value.indexOf(todo);
  if (idx > -1) {
    todos.value.splice(idx, 1);
    toast.error("Task removed!", { autoClose: 1800 });
  }
}

function onMovedToActive(evt) {
  const movedItem = evt.added?.element;
  if (movedItem && movedItem.completed) {
    movedItem.completed = false;
    movedItem.completedOrder = -1;
    movedItem.activeOrder = todos.value.filter((t) => !t.completed).length - 1;
    toast("Task moved to active!", { autoClose: 1800 });
  }
  onSort();
}

function onMovedToCompleted(evt) {
  const movedItem = evt.added?.element;
  if (movedItem && !movedItem.completed) {
    movedItem.completed = true;
    movedItem.activeOrder = -1;
    movedItem.completedOrder =
      todos.value.filter((t) => t.completed).length - 1;
    toast.info("Task marked as completed!", { autoClose: 1800 });
  }
  onSort();
}

function onSort() {
  // Update order properties for active and completed items separately
  todos.value = todos.value.map((todo) => {
    if (!todo.completed) {
      return {
        ...todo,
        activeOrder: activeTodos.value.indexOf(todo),
        completedOrder: -1,
      };
    } else {
      return {
        ...todo,
        activeOrder: -1,
        completedOrder: completedTodos.value.indexOf(todo),
      };
    }
  });
}
</script>

<style scoped>
body {
  background: #14213d;
  font-family: "Inter", Helvetica, Arial, sans-serif;
}
#app {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  gap: 24px;
  padding: 24px;
}
.todo-container {
  background: #fff;
  border-radius: 12px;
  padding: 32px 28px 24px 28px;
  min-width: 400px;
  width: 45%;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  transition: box-shadow 0.2s;
}
.todo-container.completed {
  background: #f7f7f7;
}
.input-row {
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
}
input[type="text"] {
  padding: 10px 12px;
  width: 100%;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
}
input[type="text"]:focus {
  border: 1.5px solid #42b983;
}
button {
  background: #42b983;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 18px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
button:disabled {
  background: #b2e2c7;
  cursor: not-allowed;
}
.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
  min-height: 40px;
}
.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f9f9f9;
  border-radius: 6px;
  margin-bottom: 10px;
  padding: 10px 14px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
  transition: background 0.2s;
  position: relative;
}
.todo-item.completed {
  background: #e6e6e6;
}
.todo-item label {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}
.todo-item input[type="checkbox"] {
  accent-color: #42b983;
  width: 18px;
  height: 18px;
}
.todo-item .remove {
  background: none;
  border: none;
  color: #e74c3c;
  font-size: 1.2rem;
  margin-left: 10px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
}
.todo-item .remove:hover {
  opacity: 1;
}
.drag-handle {
  cursor: grab;
  font-size: 1.2rem;
  margin-left: 12px;
  color: #b0b0b0;
  user-select: none;
}
.drag-ghost {
  opacity: 0.4;
}
.drag-chosen {
  background: #d2f5e3 !important;
}
h2 {
  font-weight: 700;
  margin-bottom: 18px;
  color: #20262e;
  font-size: 1.3rem;
  letter-spacing: 0.5px;
}
del {
  color: #b0b0b0;
}
.todo-item label span {
  color: #222;
  font-size: 1rem;
  font-weight: 500;
}
.todo-item.completed label span del {
  color: #a0a0a0;
  font-weight: 400;
}
@media (max-width: 900px) {
  #app {
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 24px;
  }
  .todo-container {
    min-width: unset;
    width: 90%;
    margin: 18px auto;
  }
}
</style>
