import { makeStyles } from "@material-ui/core";
import React, { useEffect } from "react";

const useStyles = makeStyles({
  selectbutton: {
      border: "1px solid gold",
      borderRadius: 5,
      padding: 10,
      paddingLeft: 20,
      paddingRight: 20,
      fontFamily: "Montserrat",
      cursor: "pointer",
      backgroundColor: (props) => (props.selected ? "gold" : ""),
      color: (props) => (props.selected ? "black" : ""),  
      fontWeight: (props) => (props.selected ? 700 : 500),
      "&:hover": {
          backgroundColor: "gold",
          color: "black",
          fontWeight: 600,
      },
      width: "22%",
        
  },
});



const SelectButton = ({ children, onClick,selected}) => {
  
  const classes = useStyles({selected});
    
  return (

    <span onClick={onClick} 
    className={classes.selectbutton}>
      {children} 
    </span>
  );
};


export default SelectButton;
