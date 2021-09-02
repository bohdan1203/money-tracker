import { useState, useEffect } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import "./App.css";

let data = JSON.parse(localStorage.getItem("data"));

const incomesExpenses = data || [];

const categoriesExpensesSelect = [
  "Їжа",
  "Комуналка",
  "Одяг",
  "Транспорт",
  "Кіно",
];
const categoriesIncomesSelect = ["Зарплата", "Продажі", "Депозити"];

const filterItems = {
  category: null,
  date: null,
  customDate: {},
  description: null,
};

function App() {
  const input = document.getElementById("input");

  const [modal, setModal] = useState(false);
  const [operationType, setOperationType] = useState(null);
  const [sum, setSum] = useState("");
  const [selectType, setSelectType] = useState(null);
  const [category, setCategory] = useState("Виберіть категорію");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  const [history, setHistory] = useState(data);
  const [nevermind, setNevermind] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [areYouSure, setAreYouSure] = useState(false);
  const [modalEditCategories, setModalEditCategories] = useState(false);
  const [modalFilter, setModalFilter] = useState(false);

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(incomesExpenses));
  });

  function NewExpense() {
    setOperationType("Нова витрата");
    setSelectType(categoriesExpensesSelect);
    setModal(true);
  }

  function NewIncome() {
    setOperationType("Новий дохід");
    setSelectType(categoriesIncomesSelect);
    setModal(true);
  }

  function handleSum(e) {
    if (operationType === "Нова витрата") {
      setSum(Math.round(-+e.target.value * 100) / 100);
    } else {
      setSum(Math.round(+e.target.value * 100) / 100);
    }
  }

  function handleSelect(e) {
    setCategory(e.target.value);
  }

  function handleDate(e) {
    setDate(e.target.value);
  }

  function handleDescription(e) {
    setDescription(e.target.value);
  }

  function changeBalance() {
    if (!sum || !date || category === "Виберіть категорію") return;

    incomesExpenses.push({
      category,
      sum,
      date,
      description,
      operationType,
    });

    input.value = null;
    setSum(0);
    setCategory("Виберіть категорію");
    setModal(false);
    setDate(new Date().toISOString().slice(0, 10));
    setDescription("");
    setHistory(incomesExpenses);
  }

  function handeleEdit(id) {
    setModalEdit(true);
    setEditId(id);

    setOperationType(incomesExpenses[id].operationType);
    if (incomesExpenses[id].operationType === "Нова витрата") {
      setSelectType(categoriesExpensesSelect);
    } else {
      setSelectType(categoriesIncomesSelect);
    }
  }

  function ModalAreYouSure() {
    return (
      <div className="backdrop">
        <div className="card are-you-sure">
          <h2>Ви впевнені?</h2>
          <button onClick={remove}>Видалити</button>
          <button onClick={() => setAreYouSure(false)}>Скасувати</button>
        </div>
      </div>
    );
  }

  function remove() {
    let toBeDeleted = incomesExpenses.find((event) => event.id === editId);
    let index = incomesExpenses.indexOf(toBeDeleted);

    incomesExpenses.splice(index, 1);

    setHistory(incomesExpenses);

    setNevermind(!nevermind);
    setAreYouSure(false);
    setModalEdit(false);
  }

  function changeBalanceEdit() {
    incomesExpenses[editId].sum = Math.round(+document.getElementById("edit-sum").value * 100) / 100
    if (operationType === "Нова витрата") {
      incomesExpenses[editId].sum *= -1;
    }

    incomesExpenses[editId].category =
      document.getElementById("edit-category").value;
    incomesExpenses[editId].date = document.getElementById("edit-date").value;
    incomesExpenses[editId].description =
      document.getElementById("edit-description").value;

    setModalEdit(false);
    setSum(0);
    setCategory("Виберіть категорію");
    setDate(new Date().toISOString().slice(0, 10));
    setDescription("");
  }

  function ModalEdit() {
    return (
      <div className="backdrop">
        <div className="card">
          <h2>
            Редагувати {incomesExpenses[editId].sum > 0 ? "дохід" : "витрату"}
          </h2>

          <div>
            <select
              id="edit-category"
              defaultValue={incomesExpenses[editId].category}
              onChange={handleSelect}
            >
              {selectType.map((category) => (
                <option value={category} key={category}>
                  {category}
                </option>
              ))}
            </select>

            <input
              id="edit-sum"
              type="number"
              defaultValue={Math.sqrt(incomesExpenses[editId].sum ** 2)}
              onChange={handleSum}
            />

            <input
              type="date"
              id="edit-date"
              defaultValue={incomesExpenses[editId].date}
              onChange={handleDate}
            />
            <textarea
              id="edit-description"
              cols="30"
              rows="5"
              placeholder="Опис"
              defaultValue={incomesExpenses[editId].description}
              onChange={handleDescription}
            ></textarea>
          </div>

          <button onClick={() => setAreYouSure(true)}>
            Видалити{" "}
            {incomesExpenses[editId].sum > 0 ? "цей дохід" : "цю витрату"}
          </button>
          <button onClick={changeBalanceEdit}>Підтвердити</button>
          <button onClick={() => setModalEdit(false)}>Скасувати</button>
        </div>
      </div>
    );
  }

  function filterIncomes() {
    let newArray = incomesExpenses.filter(
      (event) => event.operationType === "Новий дохід"
    );
    setHistory(newArray);
  }

  function filterExpenses() {
    let newArray = incomesExpenses.filter(
      (event) => event.operationType === "Нова витрата"
    );
    setHistory(newArray);
  }

  function unfilterAll() {
    let newArray = incomesExpenses.filter(
      (event) => event.operationType !== ""
    );
    setHistory(newArray);
  }

  function Modal() {
    return (
      <div className="backdrop">
        <div className="card">
          <h3>{operationType}</h3>
          <input
            id="input"
            type="number"
            placeholder="Сума"
            onChange={handleSum}
          />

          <select defaultValue="Виберіть категорію" onChange={handleSelect}>
            <option value="Виберіть категорію" disabled>
              Виберіть категорію
            </option>
            {selectType.map((category) => (
              <option value={category} key={category}>
                {category}
              </option>
            ))}
          </select>

          <input type="date" defaultValue={date} onChange={handleDate} />
          <textarea
            cols="30"
            rows="5"
            placeholder="Опис"
            onChange={handleDescription}
          ></textarea>

          <div id="new-operation-buttons">
            <button onClick={changeBalance}>Підтвердити</button>
            <button onClick={() => setModal(false)}>Скасувати</button>
          </div>
        </div>
      </div>
    );
  }

  function currentBalance() {
    let balance = 0;
    for (let i = 0; i < incomesExpenses.length; i++) {
      balance += incomesExpenses[i].sum;
    }
    return Math.round(balance * 100) / 100;
  }

  function addNewCategory() {
    const input = document.getElementById("add-new-category");

    if (
      input.value === "" ||
      selectType === null ||
      selectType.find((item) => item === input.value) !== undefined
    ) {
      return;
    } else {
      selectType.push(input.value);
    }

    input.value = "";
    setModalEditCategories(false);
  }

  function renameCategory() {
    if (!document.getElementById("input-edit-category").value) {
      return;
    } else {
      let index = categoriesIncomesSelect.findIndex(
        (item) => item === document.getElementById("select-edit-category").value
      );

      if (index === -1) {
        index = categoriesExpensesSelect.findIndex(
          (item) =>
            item === document.getElementById("select-edit-category").value
        );
        categoriesExpensesSelect[index] = document.getElementById(
          "input-edit-category"
        ).value;
      } else {
        categoriesIncomesSelect[index] = document.getElementById(
          "input-edit-category"
        ).value;
      }

      for (let i = 0; i < incomesExpenses.length; i++) {
        if (
          incomesExpenses[i].category ===
          document.getElementById("select-edit-category").value
        ) {
          incomesExpenses[i].category = document.getElementById(
            "input-edit-category"
          ).value;
        }
      }

      setModalEditCategories(false);
    }
  }

  function deleteCategory() {
    if (document.getElementById("select-edit-category").value === "default") {
      return;
    } else {
      let index = categoriesIncomesSelect.findIndex(
        (item) => item === document.getElementById("select-edit-category").value
      );

      if (index === -1) {
        index = categoriesExpensesSelect.findIndex(
          (item) =>
            item === document.getElementById("select-edit-category").value
        );
        categoriesExpensesSelect.splice(index, 1);
      } else {
        categoriesIncomesSelect.splice(index, 1);
      }

      for (let i = 0; i < incomesExpenses.length; i++) {
        if (
          incomesExpenses[i].category ===
          document.getElementById("select-edit-category").value
        ) {
          incomesExpenses[i].category = "Різне";
        }
      }

      setModalEditCategories(false);
    }
  }

  function ModalEditCategories() {
    return (
      <div className="backdrop">
        <div className="card">
          <div className="edit-categories add-category">
            <h3>Додати нову категорію</h3>
            <input
              type="text"
              id="add-new-category"
              placeholder="Нова категорія"
            />

            <div className="radio">
              <input
                type="radio"
                id="type-expense"
                name="type"
                value="expense"
                onChange={() => setSelectType(categoriesExpensesSelect)}
              />
              <label htmlFor="type-expense">Витрата</label>
              <input
                type="radio"
                id="type-income"
                name="type"
                value="income"
                onChange={() => setSelectType(categoriesIncomesSelect)}
              />
              <label htmlFor="type-income">Дохід</label>
            </div>

            <button onClick={addNewCategory}>Додати нову категорію</button>
          </div>

          <br />
          <br />

          <div className="edit-categories rename-remove-category">
            <h3>Перейменувати або видалити категорію</h3>

            <select
              id="select-edit-category"
              onChange={() =>
                (document.getElementById("input-edit-category").value =
                  document.getElementById("select-edit-category").value)
              }
              defaultValue="default"
            >
              <option value="default" disabled>
                Виберіть категорію
              </option>
              {categoriesExpensesSelect.map((category) => (
                <option value={category}>{category}</option>
              ))}
              {categoriesIncomesSelect.map((category) => (
                <option value={category}>{category}</option>
              ))}
            </select>

            <input type="text" id="input-edit-category" />

            <button onClick={renameCategory}>Перейменувати</button>
            <button onClick={deleteCategory}>Видалити</button>
          </div>

          <br />
          <br />

          <button onClick={() => setModalEditCategories(false)}>
            Скасувати
          </button>
        </div>
      </div>
    );
  }

  function ModalFilter() {
    return (
      <div className="backdrop">
        <div className="card">
          <div className="filter-by-time">
            <h3>Фільтри за датою</h3>
            <button onClick={filterAllTime}>За весь час</button>

            <fieldset>
              <legend>День</legend>
              <input type="date" id="filter-by-date" onChange={filterByDate} />
            </fieldset>

            <fieldset>
              <legend>Місяць</legend>
              <input
                type="month"
                id="filter-by-month"
                onChange={filterByMonth}
              />
            </fieldset>

            <fieldset>
              <legend>Відрізок</legend>
              <input
                type="date"
                id="filter-custom-min"
                onChange={filterCustomPeriod}
              />

              <input
                type="date"
                id="filter-custom-max"
                onChange={filterCustomPeriod}
              />
            </fieldset>
          </div>

          <div className="filter-by-category">
            <h3>Фільтр за категорією</h3>
            <select
              id="filter-by-category"
              defaultValue="default"
              onChange={filterByCategory}
            >
              <option value="default">Показати все</option>
              {uniqueCategory.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-by-description">
            <h3>Фільтр за описом</h3>
            <input
              type="text"
              id="filter-by-description"
              placeholder="Пошук за описом..."
              onChange={filterByDescription}
            />
          </div>

          <div className="filter-buttons">
            <button onClick={showFilteredItems}>Фільтрувати</button>
            <button onClick={() => setModalFilter(false)}>Скасувати</button>
          </div>
        </div>
      </div>
    );
  }

  function filterAllTime() {
    document.getElementById("filter-by-month").value = null;
    document.getElementById("filter-by-date").value = null;
    document.getElementById("filter-custom-min").value = null;
    document.getElementById("filter-custom-max").value = null;

    filterItems.customDate = {};
    filterItems.date = null;
  }

  function filterCustomPeriod() {
    const inputMin = document.getElementById("filter-custom-min");
    const inputMax = document.getElementById("filter-custom-max");

    document.getElementById("filter-by-month").value = null;
    document.getElementById("filter-by-date").value = null;

    filterItems.customDate.min = inputMin.value;
    filterItems.customDate.max = inputMax.value;
    filterItems.date = null;
  }

  function filterByDate() {
    const input = document.getElementById("filter-by-date");
    document.getElementById("filter-by-month").value = null;
    document.getElementById("filter-custom-min").value = null;
    document.getElementById("filter-custom-max").value = null;

    filterItems.date = input.value;
    filterItems.customDate = {};
  }

  function filterByMonth() {
    const input = document.getElementById("filter-by-month");
    document.getElementById("filter-by-date").value = null;
    document.getElementById("filter-custom-min").value = null;
    document.getElementById("filter-custom-max").value = null;

    filterItems.date = input.value;
    filterItems.customDate = {};
  }

  function filterByCategory() {
    const select = document.getElementById("filter-by-category");

    filterItems.category = select.value;
  }

  function filterByDescription() {
    const input = document.getElementById("filter-by-description");

    filterItems.description = input.value;
  }

  function showFilteredItems() {
    let filtered = incomesExpenses;

    if (filterItems.date) {
      filtered = filtered.filter((event) =>
        event.date.includes(filterItems.date)
      );
    }

    if (filterItems.customDate.min || filterItems.customDate.max) {
      if (!filterItems.customDate.max) {
        filtered = filtered.filter(
          (event) =>
            +event.date.split("-").join("") >=
            +filterItems.customDate.min.split("-").join("")
        );
      }
      if (!filterItems.customDate.min) {
        filtered = filtered.filter(
          (event) =>
            +event.date.split("-").join("") <=
            +filterItems.customDate.max.split("-").join("")
        );
      }
      if (filterItems.customDate.min && filterItems.customDate.max) {
        filtered = filtered.filter(
          (event) =>
            +event.date.split("-").join("") >=
              +filterItems.customDate.min.split("-").join("") &&
            +event.date.split("-").join("") <=
              +filterItems.customDate.max.split("-").join("")
        );
      }
    }

    if (filterItems.category) {
      filtered = filtered.filter(
        (event) => event.category === filterItems.category
      );
    }

    if (filterItems.description) {
      filtered = filtered.filter((event) =>
        event.description
          .toLowerCase()
          .includes(filterItems.description.toLowerCase())
      );
    }

    filterItems.category = null;
    filterItems.date = null;
    filterItems.description = null;

    setHistory(filtered);
    setModalFilter(false);
  }

  function sortTable() {
    const select = document.getElementById("sort-table");

    let newArray;

    switch (select.value) {
      case "new":
        newArray = history.sort(
          (a, b) => b.date.split("-").join("") - a.date.split("-").join("")
        );
        break;

      case "old":
        newArray = history.sort(
          (a, b) => a.date.split("-").join("") - b.date.split("-").join("")
        );
        break;

      case "category-a-z":
        newArray = history.sort((a, b) => {
          if (a.category.toLowerCase() < b.category.toLowerCase()) return -1;
          if (a.category.toLowerCase() > b.category.toLowerCase()) return 1;
          if (a.category.toLowerCase() === b.category.toLowerCase()) return 0;
        });
        break;

      case "category-z-a":
        newArray = history.sort((a, b) => {
          if (a.category.toLowerCase() < b.category.toLowerCase()) return 1;
          if (a.category.toLowerCase() > b.category.toLowerCase()) return -1;
          if (a.category.toLowerCase() === b.category.toLowerCase()) return 0;
        });
        break;

      case "increase":
        newArray = history.sort((a, b) => a.sum - b.sum);
        break;

      case "decrease":
        newArray = history.sort((a, b) => b.sum - a.sum);
        break;

      case "description-a-z":
        newArray = history.sort((a, b) => {
          if (a.description.toLowerCase() < b.description.toLowerCase())
            return -1;
          if (a.description.toLowerCase() > b.description.toLowerCase())
            return 1;
          if (a.description.toLowerCase() === b.description.toLowerCase())
            return 0;
        });
        break;

      case "description-z-a":
        newArray = history.sort((a, b) => {
          if (a.description.toLowerCase() < b.description.toLowerCase())
            return 1;
          if (a.description.toLowerCase() > b.description.toLowerCase())
            return -1;
          if (a.description.toLowerCase() === b.description.toLowerCase())
            return 0;
        });
        break;

      default:
        break;
    }

    setHistory(newArray);
    setNevermind(!nevermind);
  }

  for (let i = 0; i < incomesExpenses.length; i++) {
    incomesExpenses[i].id = i;
  }

  let uniqueCategory = new Set(incomesExpenses.map((event) => event.category));
  uniqueCategory = Array.from(uniqueCategory);

  function getOverallByCategories() {
    const overallByCategories = {};

    for (let i = 0; i < history.length; i++) {
      if (!overallByCategories[`${history[i].category}`]) {
        overallByCategories[`${history[i].category}`] = history[i].sum;
      } else {
        overallByCategories[`${history[i].category}`] += history[i].sum;
      }
    }

    const overallArray = Object.entries(overallByCategories);

    return overallArray;
  }

  function getOverallByDays() {
    const allDays = {};
    const overallExpensesByDays = {};
    const overallIncomesByDays = {};

    for (let i = 0; i < history.length; i++) {
      if (!allDays[`${history[i].date}`]) {
        allDays[`${history[i].date}`] = null;
      } else continue;
    }

    const daysArray = Object.keys(allDays).sort(
      (a, b) => +a.split("-").join("") - +b.split("-").join("")
    );

    for (let i = 0; i < history.length; i++) {
      if (history[i].operationType === "Новий дохід") continue;
      if (!overallExpensesByDays[`${history[i].date}`]) {
        overallExpensesByDays[`${history[i].date}`] = history[i].sum;
      } else {
        overallExpensesByDays[`${history[i].date}`] += history[i].sum;
      }
    }

    for (let i = 0; i < history.length; i++) {
      if (history[i].operationType === "Нова витрата") continue;
      if (!overallIncomesByDays[`${history[i].date}`]) {
        overallIncomesByDays[`${history[i].date}`] = history[i].sum;
      } else {
        overallIncomesByDays[`${history[i].date}`] += history[i].sum;
      }
    }

    for (let i = 0; i < daysArray.length; i++) {
      if (!overallExpensesByDays[daysArray[i]]) {
        overallExpensesByDays[daysArray[i]] = 0;
      }

      if (!overallIncomesByDays[daysArray[i]]) {
        overallIncomesByDays[daysArray[i]] = 0;
      }
    }

    const overallArray = [
      Object.entries(overallExpensesByDays).sort(
        (a, b) => +a[0].split("-").join("") - +b[0].split("-").join("")
      ),
      Object.entries(overallIncomesByDays).sort(
        (a, b) => +a[0].split("-").join("") - +b[0].split("-").join("")
      ),
      daysArray,
    ];

    return overallArray;
  }

  return (
    <div id="wrapper">
      <header>
        <h1>Ваш баланс: {currentBalance()} грн.</h1>

        <button
          id="categories-options"
          onClick={() => setModalEditCategories(true)}
        >
          Налаштування категорій
        </button>
      </header>

      <div id="new-operation-buttons">
        <button className="new-operation" onClick={NewExpense}>
          Нова витрата
        </button>
        <button className="new-operation" onClick={NewIncome}>
          Новий дохід
        </button>
      </div>

      <div id="display-options">
        <button className="display" onClick={filterIncomes}>
          Показати доходи
        </button>
        <button className="display" onClick={filterExpenses}>
          Показати витрати
        </button>
        <button className="display" onClick={unfilterAll}>
          Показати все
        </button>

        <select
          className="display"
          name="sort"
          id="sort-table"
          defaultValue="default"
          onChange={sortTable}
        >
          <option value="default" disabled>
            Сортувати таблицю
          </option>
          <option value="new">Спочатку новіші</option>
          <option value="old">Спочатку старіші</option>
          <option value="category-a-z">За категоріями (А - Я)</option>
          <option value="category-z-a">За категоріями (Я - А)</option>
          <option value="increase">За сумою у порядку зростання</option>
          <option value="decrease">За сумою у порядку спадання</option>
          <option value="description-a-z">За описом (А - Я)</option>
          <option value="description-z-a">За описом (Я - А)</option>
        </select>
      </div>

      <div id="filter-buttons">
        <button className="filter" onClick={() => setModalFilter(true)}>
          Фільтри
        </button>
        <button className="filter" onClick={unfilterAll}>
          Скинути всі фільтри
        </button>
      </div>

      <main>
        <div class="charts">
          <Doughnut
            height={1}
            width={4}
            data={{
              labels: getOverallByCategories()
                .filter((event) => event[1] < 0)
                .map((event) => event[0]),
              datasets: [
                {
                  data: getOverallByCategories()
                    .filter((event) => event[1] < 0)
                    .map((event) => event[1]),
                  borderColor: ["black"],
                  backgroundColor: getOverallByCategories()
                    .filter((event) => event[1] < 0)
                    .map(
                      (event) =>
                        `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
                          Math.random() * 255
                        })`
                    ),
                },
              ],
            }}
          />

          <Bar
            height={4}
            width={4}
            data={{
              labels: getOverallByCategories()
                .filter((event) => event[1] > 0)
                .map((event) => event[0]),
              datasets: [
                {
                  label: "Доходи",
                  data: getOverallByCategories()
                    .filter((event) => event[1] > 0)
                    .map((event) => event[1]),
                  borderColor: ["black"],
                  backgroundColor: getOverallByCategories()
                    .filter((event) => event[1] > 0)
                    .map(
                      (event) =>
                        `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
                          Math.random() * 255
                        })`
                    ),
                },
              ],
            }}
          />

          <Line
            height={4}
            width={4}
            data={{
              labels: getOverallByDays()[2],
              datasets: [
                {
                  label: "Витрати",
                  data: getOverallByDays()[0].map((event) => event[1] * -1),
                  borderColor: "red",
                },
                {
                  label: "Доходи",
                  data: getOverallByDays()[1],
                  borderColor: "green",
                },
              ],
            }}
          />
        </div>

        <div id="table">
          <ol>
            <li>
              <div className="cell table-top">
                <p>Дата</p>
              </div>
              <div className="cell table-top">
                <p>Категорія</p>
              </div>
              <div className="cell table-top">
                <p>Сума</p>
              </div>
              <div className="cell table-top">
                <p>Опис</p>
              </div>
              <div className="cell table-top">Опції</div>
            </li>
            {history.length === 0 ? (
              <p id="no-data">Немає даних для відображення</p>
            ) : (
              history.map((event) => (
                <li key={event.id}>
                  <div className="cell">{event.date}</div>
                  <div className="cell">{event.category}</div>
                  <div className="cell">{event.sum + " грн."}</div>
                  <div className="cell">{event.description}</div>
                  <button
                    className="cell"
                    onClick={() => handeleEdit(event.id)}
                  >
                    Редагувати
                  </button>
                </li>
              ))
            )}
          </ol>
        </div>

        {modal && Modal()}
        {modalEdit && ModalEdit()}
        {areYouSure && ModalAreYouSure()}
        {modalEditCategories && ModalEditCategories()}
        {modalFilter && ModalFilter()}
      </main>
    </div>
  );
}

export default App;