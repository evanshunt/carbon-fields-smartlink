/**
 * External dependencies.
 */
import { Component } from '@wordpress/element';
import { RadioControl } from '@wordpress/components';
import Select from 'react-select';

let initial;
let displayField;

class SmartLinkField extends Component {
	/**
	 * Handles the change of the input.
	 *
	 * @param  {Object} e
	 * @return {void}
	 */

    stringifyField = () => JSON.stringify({
        linkType: this.displayField.linkType,
        target: this.displayField.target,
        postId: this.displayField.postId,
        url: this.displayField.url
    });

    setInitial = () => {
        if (typeof this.initial === 'undefined') {
            this.initial = {
                linkType: this.displayField.linkType,
                target: this.displayField.target,
                postId: this.displayField.postId,
                url: this.displayField.url
            }
        }
    }

    handleTypeChange = (option) => {
        const { id, field, onChange } = this.props;
        const { setInitial, stringifyField } = this;

        setInitial();
        this.displayField.postId = '';
        this.displayField.linkType = option;
        if (option) {
            let post = field.posts.find(post => post.value === this.displayField.postId);
            this.displayField.url = (typeof post !== 'undefined') ? post.url : '';
        }
        onChange(
            id,
            stringifyField()
        );
    }

    handleTargetChange = (option) => {
        const { id, onChange } = this.props;
        const { setInitial, stringifyField } = this;

        setInitial();
        this.displayField.target = option;
        onChange(
            id,
            stringifyField()
        );
    }

    handleUrlChange = (e) => {
        const { id, onChange } = this.props;
        const changedValue = e.target.value;
        const { setInitial, stringifyField } = this;

        setInitial();
        this.displayField.url = changedValue;
        onChange(
            id,
            stringifyField()
        );
    }

    handleEmailChange = (e) => {
        const { id, onChange } = this.props;
        const changedValue = e.target.value;
        const { setInitial, stringifyField } = this;

        setInitial();
        this.displayField.url = `mailto:${changedValue}`;
        onChange(
            id,
            stringifyField()
        );
    }

    handleTelChange = (e) => {
        const { id, onChange } = this.props;
        const changedValue = e.target.value;
        const { setInitial, stringifyField } = this;

        setInitial();
        this.displayField.url = `tel:${changedValue.replace(/\s/g, '')}`;
        onChange(
            id,
            stringifyField()
        );
    }

    handleIdChange = (changedValue) => {
        const { id, onChange } = this.props;
        const { setInitial, stringifyField } = this;

        setInitial();
        this.displayField.postId = changedValue.value;
        this.displayField.url = changedValue.url;
        onChange(
            id,
            stringifyField()
        );
    }

    handleRestore = (e) => {
        e.preventDefault();
        const { id, onChange } = this.props;
        const { setInitial, stringifyField } = this;

        setInitial();
        if (this.initial !== 'undefined') {
            this.displayField.linkType = this.initial.linkType;
            this.displayField.target = this.initial.target;
            this.displayField.postId = this.initial.postId;
            this.displayField.url = this.initial.url;
            onChange(
                id,
                stringifyField()
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

        const parsedJson = value ? JSON.parse(value) : {};
        const selectedId = parsedJson && parsedJson.hasOwnProperty('postId') ? parsedJson.postId : null;
        const linkType = parsedJson && parsedJson.hasOwnProperty('linkType') ? parsedJson.linkType : 1;
        const target = parsedJson && parsedJson.hasOwnProperty('target') ? parsedJson.target : '_self';
        const url = parsedJson && parsedJson.hasOwnProperty('url') ? parsedJson.url : '';
        let post = field.posts.find(post => post.value === selectedId);

        this.displayField = {
            postId: selectedId,
            linkType: linkType,
            target: target,
            url: url
        };
        return <div>
            <div className="link-config">
                <fieldset>
                    <legend>Link Type</legend>
                    <RadioControl
                        selected={linkType}
                        options={[
                            {label: 'Internal', value: '1'},
                            {label: 'External', value: '0'},
                            {label: 'Email', value: '2'},
                            {label: 'Phone', value: '3'},
                        ]}
                        onChange={handleTypeChange}
                    />
                </fieldset>
                <fieldset>
                    <legend>Target</legend>
                    <RadioControl
                        selected={target}
                        options={[
                            {label: 'Same Tab', value: '_self'},
                            {label: 'New Tab', value: '_blank'},
                        ]}
                        onChange={handleTargetChange}
                    />
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
