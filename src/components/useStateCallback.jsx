import { useEffect, useRef, useState, useCallback } from 'react';

function useStateCallback(initVal) {
  let [val, setVal] = useState(initVal);
  let cbRef = useRef(null);
  let first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }

    if (typeof cbRef.current === "function") {
      console.log("calling cb");
      cbRef.current();
    }
  }, [val]);

  let setValCB = useCallback((newVal, cb) => {
    console.log("setValCB", newVal);
    cbRef.current = cb;
    setVal(newVal);
  }, []);

  return [val, setValCB];
}

export default useStateCallback;