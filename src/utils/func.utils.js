export function getNameOfCategory(category, metall1) {
  let metall = getMetall(metall1)
  if (
    (category == "Ювелирные серьги" && metall == "золото") ||
    (category == "Ювелирные кольца" && metall == "золото")  ||
    (category == "Ювелирные колье" && metall == "золото")  ||
    (category == "Ювелирные подвески" && metall == "золото")  ||
    (category == 'silaeva_natalia' && metall == "золото") || 
    (category == 'Ювелирные броши' && metall == "золото")
  ) {
    return "Силаева Наталья";
  } else if (
    (category == "Ювелирные серьги" && metall == "серебро") ||
    (category == "Ювелирные кольца" && metall == "серебро")  ||
    (category == "Ювелирные колье" && metall == "серебро")  ||
    (category == "Ювелирные подвески" && metall == "серебро")  ||
    (category == "Ювелирные браслеты" && metall == "серебро")  ||
    (category == "Ювелирные цепочки" && metall == "серебро")  ||
    (category == "Ювелирные запонки" && metall == "серебро")  ||
    (category == "Ювелирные зажимы" && metall == "серебро")  ||
    (category == "Ионизаторы серебряные" && metall == "серебро")  ||
    (category == "Столовое серебро" && metall == "серебро")  ||
    (category == "Ювелирные сувениры" && metall == "серебро")  ||
    (category == "Ювелирные броши" && metall == "серебро")  ||
    (category == "Ионизаторы воды" && metall == "серебро")  ||
    (category == 'semenova_elena' && metall == "серебро") 
  ) {
    return "Семенова Елена";
  } else {
    return "Нет";
  }
}

export function getNameOManager(name, array) {
  let new_array = [];
 if (name == "semenova_elena") {
    new_array = array.filter(
        (item) =>
        (item.category == "Ювелирные браслеты") ||
        (item.category == "Ювелирные цепочки")  ||
        (item.category == "Ювелирные запонки")  ||
        (item.category == "Ювелирные зажимы")  ||
        (item.category == "Ионизаторы серебряные")  ||
        (item.category == "Столовое серебро")  ||
        (item.category == "Ювелирные сувениры")  ||
        (item.category == "Ионизаторы воды")  || 
        (item.category == "Ювелирные броши" && getMetall(item.wb_metall) == "серебро") ||
        (item.category == "Ювелирные серьги" && getMetall(item.wb_metall) == "серебро")  ||
        (item.category == "Ювелирные кольца" && getMetall(item.wb_metall) == "серебро")  ||
        (item.category == "Ювелирные колье")  || 
        (item.category == "Ювелирные подвески" && getMetall(item.wb_metall) == "серебро") 
      );

      return new_array;
  } else if (name == "silaeva_natalia") {
    new_array = array.filter(
        (item) =>
        (item.category == "Ювелирные броши" && getMetall(item.wb_metall) == "золото") ||
        (item.category == "Ювелирные серьги" && getMetall(item.wb_metall) == "золото") ||
        (item.category == "Ювелирные кольца" && getMetall(item.wb_metall) == "золото") ||
        (item.category == "Ювелирные подвески" && getMetall(item.wb_metall) == "золото")
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


function getMetall(metall) {
  let metall1 = metall;
  if(typeof(metall) == "string") {

  if(metall.includes('золото') || metall.includes('ЗОЛОТО')) {
    metall1 =  'золото';
  } else if(metall.includes('керамика')) {
    metall1 = 'керамика';
  } else if(metall.includes('серебро') || metall.includes('Серебро')) {
    metall1 ='серебро';
  }
        
}

  return metall1;
}