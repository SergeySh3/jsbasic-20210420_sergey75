function sumSalary(salaries) {
  let sum = 0;
  
  for (const prop in salaries)
    if ((typeof salaries[prop] === 'number') && isFinite(salaries[prop])){
    sum +=salaries[prop];
    }
  return sum;   
}


