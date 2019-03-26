/**
 * External dependencies.
 */
import { Component } from '@wordpress/element';

const stringifyField = (field) => JSON.stringify({
	linkType: field.linkType,
	target: field.target,
	postId: field.postId,
	url: field.url
});

const setInitial = (field) => {
	let newField = field;
	if(typeof newField.initial === 'undefined') {
		newField.initial = {
			linkType: newField.linkType,
			target: newField.target,
			postId: newField.postId,
			url: newField.url			
		}
	}
	return newField;
}

class SmartLinkField extends Component {
	/**
	 * Handles the change of the input.
	 *
	 * @param  {Object} e
	 * @return {void}
	 */
    handleChange = (e) => {
        const { id, onChange } = this.props;

        onChange(id, e.target.value);
    }

	/**
	 * Render a number input field.
	 *
	 * @return {Object}
	 */
    render() {
        const {
            id,
            name,
            value,
            field
        } = this.props;
        const { handleChange } = this;

        return (
            <input
                type="number"
                id={id}
                name={name}
                value={value}
                max={field.max}
                min={field.min}
                step={field.step}
                className="cf-number__input"
                onChange={this.handleChange}
            />
        );
    }
}

export default NumberField;