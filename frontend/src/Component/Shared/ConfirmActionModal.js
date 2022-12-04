import { React, useEffect } from "react";
import M from "materialize-css";
import "../../Css/Responsive.css";

function ConfirmActionModal(props) {
    useEffect(() => {
        var elems = document.querySelectorAll('.modal');
        M.Modal.init(elems);
    }, []);

    return (
        <div id={props.id} className="modal">
            <div className="modal-content">
                <h5 className="text-responsive">{props.header}</h5>
                <p>{props.content}</p>
            </div>
            <div className="modal-footer">
                <button className="modal-close btn waves-light left text-responsive-btn">Cancel</button>
                <button className="modal-close btn waves-light text-responsive-btn" onClick={props.callback}>Confirm</button>
            </div>
        </div>);
}

export default ConfirmActionModal;