/**
 * External dependencies.
 */
import { Component } from '@wordpress/element';
import Select from 'react-select';

let initial;
let displayField;

const stringifyField = (field) => JSON.stringify({
    linkType: field.linkType,
    target: field.target,
    postId: field.postId,
    url: field.url
});

const setInitial = (field) => {
    if (typeof initial === 'undefined') {
        initial = {
            linkType: field.linkType,
            target: field.target,
            postId: field.postId,
            url: field.url
        }
    }
}

class SmartLinkField extends Component {
	/**
	 * Handles the change of the input.
	 *
	 * @param  {Object} e
	 * @return {void}
	 */

    handleTypeChange = (e) => {
        const { id, field, onChange } = this.props;
        const changedValue = e.target.value;
        setInitial(displayField);

        displayField.postId = '';
        displayField.linkType = changedValue;
        if (changedValue) {
            let post = field.posts.find(post => post.value === displayField.postId);
            displayField.url = (typeof post !== 'undefined') ? post.url : '';
        }
        onChange(
            id,
            stringifyField(displayField)
        );
    }

    handleTargetChange = (e) => {
        const { id, onChange } = this.props;
        const changedValue = e.target.value;
        setInitial(displayField);

        displayField.target = changedValue;
        onChange(
            id,
            stringifyField(displayField)
        );
    }

    handleUrlChange = (e) => {
        const { id, onChange } = this.props;
        const changedValue = e.target.value;
        setInitial(displayField);

        displayField.url = changedValue;
        onChange(
            id,
            stringifyField(displayField)
        );
    }

    handleEmailChange = (e) => {
        const { id, onChange } = this.props;
        const changedValue = e.target.value;
        setInitial(displayField);

        displayField.url = `mailto:${changedValue}`;
        onChange(
            id,
            stringifyField(displayField)
        );
    }

    handleTelChange = (e) => {
        const { id, onChange } = this.props;
        const changedValue = e.target.value;
        setInitial(displayField);

        displayField.url = `tel:${changedValue.replace(/\s/g, '')}`;
        onChange(
            id,
            stringifyField(displayField)
        );
    }

    handleIdChange = (changedValue) => {
        const { id, onChange } = this.props;
        setInitial(displayField);

        displayField.postId = changedValue.value;
        displayField.url = changedValue.url;
        onChange(
            id,
            stringifyField(displayField)
        );
    }

    handleRestore = (e) => {
        e.preventDefault();
        const { id, onChange } = this.props;
        setInitial(displayField);

        if (initial !== 'undefined') {
            displayField.linkType = initial.linkType;
            displayField.target = initial.target;
            displayField.postId = initial.postId;
            displayField.url = initial.url;
            onChange(
                id,
                stringifyField(displayField)
            );
        }
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
            field,
            value
        } = this.props;
        const {
            handleTypeChange,
            handleTargetChange,
            handleUrlChange,
            handleEmailChange,
            handleTelChange,
            handleIdChange,
            handleRestore
        } = this;

        displayField = JSON.parse(value);
        const selectedId = Object.prototype.hasOwnProperty(displayField, 'postId') ? displayField.postId : null;
        const linkType = Object.prototype.hasOwnProperty(displayField, 'linkType') ? displayField.linkType : 0;
        const target = Object.prototype.hasOwnProperty(displayField, 'target') ? displayField.target : null;
        const url = Object.prototype.hasOwnProperty(displayField, 'url') ? displayField.url : null;
        let post = field.posts.find(post => post.value === selectedId);

        return <div>
            <div className="link-config">
                <fieldset>
                    <legend>Link Type</legend>
                    <label>
                        <input
                            type="radio"
                            name={name + 'linkType'}
                            value='1'
                            onChange={handleTypeChange}
                            checked={linkType == 1 ? 'checked' : ''}
                        />Internal
                    </label>
                    <label>
                        <input
                            type="radio"
                            name={name + 'linkType'}
                            value='0'
                            onChange={handleTypeChange}
                            checked={linkType == 0 ? 'checked' : ''}
                        />External
                    </label>
                    <label>
                        <input
                            type="radio"
                            name={name + 'linkType'}
                            value='2'
                            onChange={handleTypeChange}
                            checked={linkType == 2 ? 'checked' : ''}
                        />Email
                    </label>
                    <label>
                        <input
                            type="radio"
                            name={name + 'linkType'}
                            value='3'
                            onChange={handleTypeChange}
                            checked={linkType == 3 ? 'checked' : ''}
                        />Phone
                    </label>
                </fieldset>
                <fieldset>
                    <legend>Target</legend>
                    <label>
                        <input
                            type="radio"
                            name={name + 'target'}
                            value='_self'
                            onChange={handleTargetChange}
                            checked={target == '_self'}
                        />Same Tab
				</label>
                    <label>
                        <input
                            type="radio"
                            name={name + 'target'}
                            value='_blank'
                            onChange={handleTargetChange}
                            checked={target == '_blank'}
                        />New Tab
			</label>
                </fieldset>
                <button onClick={handleRestore}>Restore Saved</button>
            </div>
            {linkType == '1' ?
                <label>
                    Page
				<Select
                        value={post ? post : ''}
                        onChange={handleIdChange}
                        options={field.posts}
                    />
                </label>
                :
                <span></span>
            }
            {linkType == '2' ?
                <label>Email
				<input
                        type="text"
                        name={name + 'email'}
                        value={linkType == '2' ? url.slice(7) : ''}
                        onChange={handleEmailChange}
                    />
                </label>
                :
                <span></span>
            }
            {linkType == '3' ?
                <label>Phone
				<input
                        type="text"
                        name={name + 'phone'}
                        value={linkType == '3' ? url.slice(4) : ''}
                        onChange={handleTelChange}
                    />
                </label>
                :
                <span></span>
            }
            <label>
                URL
			<input
                    type="text"
                    name={name + 'url'}
                    value={url ? url : ''}
                    readOnly={parseInt(linkType)}
                    onChange={handleUrlChange}
                />
            </label>
            <input
                type="hidden"
                id={id}
                name={name}
                value={value}
                readOnly={true}
            />
        </div>;
    }
}

export default SmartLinkField;