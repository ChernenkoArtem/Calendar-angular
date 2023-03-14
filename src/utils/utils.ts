export const isEmptyObj = (obj: Object) => {
    for(const prop in obj) {
        if(obj.hasOwnProperty(prop) || !obj[prop as keyof Object])
            return false;
    }
    return true;
};


export const objKeysHasValue = (obj: Object) => {
  for(const prop in obj) {
    if(!obj[prop as keyof Object])
      return false;
  }
  return true;
};

export const uid = () => ( Date.now().toString(36) + Math.random().toString(36).substr(2));
