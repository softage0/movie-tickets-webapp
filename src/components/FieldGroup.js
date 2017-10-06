import React, {Component} from 'react';
import {FormGroup, Col, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap';


class FieldGroup extends Component {
    render() {
        const {id, label, help, ...props} = this.props;

        return (
            <FormGroup controlId={id}>
                <Col componentClass={ControlLabel} xs={3}>
                    {label}
                </Col>
                <Col xs={9}>
                    <FormControl {...props} />
                </Col>
                {help && <HelpBlock>{help}</HelpBlock>}
            </FormGroup>
        )
    }
}

export default FieldGroup;
