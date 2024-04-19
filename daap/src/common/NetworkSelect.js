import React, { useCallback, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import { getCurrentNetworkName } from "../utils/helper";
import config from "../utils/config";
import { currentConnection } from "../constants";
import etherIcon from "../assets/ether.png";
import binanceIcon from "../assets/binance.png";
import polygonIcon from "../assets/polygon.png";
import { CHANGE_NETWORK } from "../actions/types";
import store from "../store";
import { connect } from "react-redux";
import { useSwitchChain } from "wagmi";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-around",
  },
  imgIcon: {
    marginLeft: 10,
    height: 23,
  },
  buttonDrop: {
    display: "flex",
    justifyContent: "space-between",
    color: "black",
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: "grey",
      color: "#100525",
    },
  },
  main: {
    color: "white",
    backgroundColor: "#100525",
    border: "1px solid rgba(224, 7, 125, 0.7)",
    borderRadius: 60,
    paddingLeft: 15,
    height: 40,
    width: "full-width",
    marginRight: 7,
    paddingTop: 3,
  },
  networkName: {},
}));

const NetworkSelect = ({ account: { currentChain } }) => {
  const classes = useStyles();

  const [selectedChain, setSelectedChain] = React.useState(
    parseInt(localStorage.getItem("cachedChain") || config.chainId)
  );

  const { switchNetwork } = useSwitchChain();

  const handleChange = useCallback(
    async (targetChain) => {
      try {
        console.log("target chain", targetChain);
        switchNetwork(targetChain);
      } catch (error) {
        localStorage.cachedChain = targetChain;
        const _network = getCurrentNetworkName(targetChain);
        store.dispatch({
          type: CHANGE_NETWORK,
          payload: { network: _network, chain: targetChain },
        });
        setSelectedChain(targetChain);
        console.log("chain switch error ", error);
      }
    },
    [switchNetwork]
  );

  // useEffect(() => {
  //   if (!chainId) {
  //     return;
  //   }
  //   store.dispatch({
  //     type: CHANGE_NETWORK,
  //     payload: {
  //       network: getCurrentNetworkName(chainId),
  //       chain: chainId,
  //     },
  //   });
  //   localStorage.setItem("currentNetwork", chainId);

  //   setSelectedChain(chainId);
  // }, [chainId]);
  return (
    <div>
      <FormControl className={classes.root}>
        <Select
          className={classes.main}
          value={selectedChain}
          disableUnderline={true}
          notched={true}
          id="adornment-weight"
          onChange={({ target: { value } }) => handleChange(value)}
        >
          <MenuItem
            value={currentConnection === "testnet" ? 42 : 1}
            className={classes.buttonDrop}
          >
            <span className={classes.networkName}>Ethereum</span>
            <img className={classes.imgIcon} src={etherIcon} />
          </MenuItem>

          <MenuItem
            value={currentConnection === "testnet" ? 421613 : 42161}
            className={classes.buttonDrop}
          >
            <span className={classes.networkName}>Arbitrum one</span>
            <img
              className={classes.imgIcon}
              alt="arbitrum"
              src={
                "https://s2.coinmarketcap.com/static/img/coins/64x64/11841.png"
              }
            />
          </MenuItem>

          <MenuItem
            value={currentConnection === "testnet" ? 97 : 56}
            className={classes.buttonDrop}
          >
            <span className={classes.networkName}>BSC</span>
            <img className={classes.imgIcon} src={binanceIcon} />
          </MenuItem>
          <MenuItem
            value={currentConnection === "testnet" ? 80001 : 137}
            className={classes.buttonDrop}
          >
            <span className={classes.networkName}>Polygon</span>
            <img className={classes.imgIcon} src={polygonIcon} />
          </MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

const mapStateToProps = (state) => ({
  account: state.account,
});

export default connect(mapStateToProps, {})(NetworkSelect);
