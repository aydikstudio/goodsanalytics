export function getNameOfCategory(value) {
    if(value == 'Ювелирные серьги' ||
    value == 'Ювелирные кольца'
    || value == 'Ювелирные колье' 
    || value == 'Ювелирные подвески') {
        return 'Силаева Наталья';
    } else if(value == 'Ювелирные браслеты' ||
    value == 'Ювелирные цепочки'
    || value == 'Ювелирные запонки' 
    || value == 'Ювелирные зажимы') {
        return 'Семенова Елена';
    } else if(value == 'Ионизаторы серебряные' ||
    value == 'Столовое серебро'
    || value == 'Ювелирные сувениры' 
    || value == 'Ювелирные броши' || value == 'Ионизаторы воды') {
        return 'Алиев Айдемир';
    }
    else {
        return 'Нет';
    }
}

export function getStatus(val) {
    if(val == 0) {
        return 'На модерации'
    } else if(val == 1) {
        return 'Одобрено'
    } else if(val == 2) {
      return 'Отклонено'
  } else if(val == 3) {
    return 'Редактируется'
}
  
}