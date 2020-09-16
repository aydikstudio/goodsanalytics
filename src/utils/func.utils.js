export function getNameOfCategory(value) {
  if (
    value == "Ювелирные серьги" ||
    value == "Ювелирные кольца" ||
    value == "Ювелирные колье" ||
    value == "Ювелирные подвески" ||
    value == 'silaeva_natalia'
  ) {
    return "Силаева Наталья";
  } else if (
    value == "Ювелирные браслеты" ||
    value == "Ювелирные цепочки" ||
    value == "Ювелирные запонки" ||
    value == "Ювелирные зажимы" ||
    value == 'semenova_elena'
  ) {
    return "Семенова Елена";
  } else if (
    value == "Ионизаторы серебряные" ||
    value == "Столовое серебро" ||
    value == "Ювелирные сувениры" ||
    value == "Ювелирные броши" ||
    value == "Ионизаторы воды" ||
    value == 'aliev_aydemir'
  ) {
    return "Алиев Айдемир";
  } else {
    return "Нет";
  }
}

export function getNameOManager(name, array) {
  let new_array = [];
  if (name == "aliev_aydemir") {
    new_array = array.filter(
      (item) =>
        item.category == "Ионизаторы серебряные" ||
        item.category == "Столовое серебро" ||
        item.category == "Ювелирные сувениры" ||
        item.category == "Ионизаторы воды"
    );
    return new_array;
  } else if (name == "semenova_elena") {
    new_array = array.filter(
        (item) =>
        item.category == "Ювелирные браслеты" ||
        item.category == "Ювелирные цепочки" ||
        item.category == "Ювелирные запонки" ||
        item.category == "Ювелирные зажимы"
      );
      return new_array;
  } else if (name == "silaeva_natalia") {
    new_array = array.filter(
        (item) =>
        item.category == "Ювелирные серьги" ||
        item.category == "Ювелирные кольца" ||
        item.category == "Ювелирные колье" ||
        item.category == "Ювелирные подвески"
      );
      return new_array;
  } else {
      return new_array;
  }
}

export function getStatus(val) {
  if (val == 0) {
    return "На модерации";
  } else if (val == 1) {
    return "Одобрено";
  } else if (val == 2) {
    return "Отклонено";
  } else if (val == 3) {
    return "Редактируется";
  }
}
