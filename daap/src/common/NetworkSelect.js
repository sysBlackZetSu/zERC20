import { connect } from "react-redux";
import { Button, makeStyles } from "@material-ui/core";
import {
    useWeb3Modal,
} from '@web3modal/wagmi/react';

const useStyles = makeStyles((theme) => ({
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
    }
}));

const NetworkSelect = ({ account: { currentChain } }) => {
    const classes = useStyles();
    const modal = useWeb3Modal();
    return (
        <div>
            <Button
                onClick={() => modal.open({ view: 'Networks' })}
                className={classes.main}
                variant="contained"
            >
                Choose Network
            </Button>
        </div>
    );
};

const mapStateToProps = (state) => ({
    account: state.account,
});

export default connect(mapStateToProps, {})(NetworkSelect);
