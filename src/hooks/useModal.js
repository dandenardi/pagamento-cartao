import { useState } from "react";

const useModal = () => {


    const [isShowing, setIsShowing] = useState(false);
    const [detail, setDetail] = useState();

    function toggle(detail){
      setIsShowing(!isShowing);
      setDetail(detail);
    }

    return {
      isShowing,
      toggle,
      detail,
    }
};

export default useModal;
