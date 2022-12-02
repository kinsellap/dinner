import { React, useEffect } from "react";
import M from 'materialize-css';

function DinnerModal(props) {
    useEffect(() => {
        var elems = document.querySelectorAll('.modal');
        M.Modal.init(elems);
    }, []);

    return (
        <div id="modal" class="modal">
            <div class="modal-content">
                <h5>{props?.header}</h5>
                <p>{props?.content}</p>
            </div>
            <div class="modal-footer">
                <button className="modal-close btn waves-light" onClick={props?.callback}>Confirm</button>
            </div>
        </div>);
}

export default DinnerModal;