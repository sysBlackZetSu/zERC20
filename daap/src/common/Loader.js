import { CircularProgress, makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({}));

const Loader = ({ height }) => {
  const classes = useStyles();
  return (
    <div
      style={{
        height: height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress className={classes.numbers} />
    </div>
  );
};

export default React.memo(Loader);
