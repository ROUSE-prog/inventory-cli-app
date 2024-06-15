const fs = require('fs');
const readlineSync = require('readline-sync');
const chalk = require('chalk');

const dataFilePath = './data/inventory.json';


const loadData = () => {
  const data = fs.readFileSync(dataFilePath);
  return JSON.parse(data);
};


const saveData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};


const showMenu = () => {
  console.log(chalk.green("\nInventory Management System"));
  console.log("1. Add New Item");
  console.log("2. View All Items");
  console.log("3. View Item Details");
  console.log("4. Update Item");
  console.log("5. Delete Item");
  console.log("6. Add Item to Cart");
  console.log("7. View Cart");
  console.log("8. Cancel Cart");
  console.log("9. Exit");
};

const addItem = () => {
  let inventory = loadData();
  const id = inventory.length ? inventory[inventory.length - 1].id + 1 : 1;
  const name = readlineSync.question('Enter item name: ');
  const priceInCents = readlineSync.questionInt('Enter item price in cents: ');
  const inStock = readlineSync.question('Is item in stock (yes/no): ') === 'yes';
  const category = readlineSync.question('Enter item category: ');

  inventory.push({ id, name, priceInCents, inStock, category });
  saveData(inventory);
  console.log(chalk.green('Item added successfully!'));
};

const viewAllItems = () => {
  const inventory = loadData();
  console.table(inventory);
};

const viewItemDetails = () => {
  const inventory = loadData();
  const itemId = readlineSync.questionInt('Enter item ID: ');
  const item = inventory.find(item => item.id === itemId);
  if (item) {
    console.table(item);
  } else {
    console.log(chalk.red('Item not found!'));
  }
};

const updateItem = () => {
  let inventory = loadData();
  const itemId = readlineSync.questionInt('Enter item ID: ');
  const itemIndex = inventory.findIndex(item => item.id === itemId);

  if (itemIndex !== -1) {
    const name = readlineSync.question('Enter new item name: ');
    const priceInCents = readlineSync.questionInt('Enter new item price in cents: ');
    const inStock = readlineSync.question('Is item in stock (yes/no): ') === 'yes';
    const category = readlineSync.question('Enter new item category: ');

    inventory[itemIndex] = { id: itemId, name, priceInCents, inStock, category };
    saveData(inventory);
    console.log(chalk.green('Item updated successfully!'));
  } else {
    console.log(chalk.red('Item not found!'));
  }
};

const deleteItem = () => {
  let inventory = loadData();
  const itemId = readlineSync.questionInt('Enter item ID: ');
  const newInventory = inventory.filter(item => item.id !== itemId);

  if (inventory.length !== newInventory.length) {
    saveData(newInventory);
    console.log(chalk.green('Item deleted successfully!'));
  } else {
    console.log(chalk.red('Item not found!'));
  }
};

const cart = [];

const addItemToCart = () => {
  const inventory = loadData();
  const itemId = readlineSync.questionInt('Enter item ID: ');
  const item = inventory.find(item => item.id === itemId);

  if (item) {
    cart.push(item);
    console.log(chalk.green('Item added to cart!'));
  } else {
    console.log(chalk.red('Item not found!'));
  }
};

const viewCart = () => {
  if (cart.length === 0) {
    console.log(chalk.yellow('Cart is empty!'));
  } else {
    console.table(cart);
    const total = cart.reduce((sum, item) => sum + item.priceInCents, 0);
    console.log(chalk.green(`Total Price: ${total / 100} USD`));
  }
};

const cancelCart = () => {
  cart.length = 0;
  console.log(chalk.green('Cart has been emptied!'));
};


while (true) {
  showMenu();
  const choice = readlineSync.questionInt('Choose an option: ');

  switch (choice) {
    case 1:
      addItem();
      break;
    case 2:
      viewAllItems();
      break;
    case 3:
      viewItemDetails();
      break;
    case 4:
      updateItem();
      break;
    case 5:
      deleteItem();
      break;
    case 6:
      addItemToCart();
      break;
    case 7:
      viewCart();
      break;
    case 8:
      cancelCart();
      break;
    case 9:
      console.log(chalk.blue('Goodbye!'));
      process.exit(0);
    default:
      console.log(chalk.red('Invalid option!'));
  }
}
