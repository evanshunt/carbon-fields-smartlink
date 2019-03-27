/**
 * External dependencies.
 */
import { Component } from '@wordpress/element';
import Select from 'react-select';

const stringifyField = (field) => JSON.stringify({
	linkType: field.linkType,
	target: field.target,
	postId: field.postId,
	url: field.url
});

const setInitial = (field) => {
    let newField = {...field};
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

let displayField;

class SmartLinkField extends Component {
	/**
	 * Handles the change of the input.
	 *
	 * @param  {Object} e
	 * @return {void}
	 */

    handleTypeChange = (e) => {
        const { id, field, onChange} = this.props;
        const {value} = e.target;
        let newField = setInitial(field);

        newField.postId = '';
        newField.linkType = value;
        if (value) {
            let post = newField.posts.find(post => post.value === newField.postId);
            newField.url = (typeof post !== 'undefined') ? post.url : '';
        }
        onChange(
            id,
            stringifyField(newField)
        );
    }

    handleTargetChange = (e) => {
        const { id, field, onChange } = this.props;
        const { value } = e.target;
        let newField = setInitial(field);
        console.log(newField);

        newField.target = value;
        console.log(newField);
        onChange(
            id,
            stringifyField(newField)
        );
    }

    handleUrlChange = (e) => {
        const { id, field, onChange } = this.props;
        const { value } = e.target;
        let newField = setInitial(field);

        newField.url = value;
        onChange(
            id,
            stringifyField(newField)
        );
    }

    handleEmailChange = (e) => {
        const { id, field, onChange } = this.props;
        const { value } = e.target;
        let newField = setInitial(field);

        newField.url = `mailto:${value}`;
        onChange(
            id,
            stringifyField(newField)
        );
    }

    handleTelChange = (e) => {
        const { id, field, onChange } = this.props;
        const { value } = e.target;
        let newField = setInitial(field);

        newField.url = `tel:${value.replace(/\s/g, '')}`;
        onChange(
            id,
            stringifyField(newField)
        );
    }

    handleIdChange = (e) => {
        const { id, field, onChange } = this.props;
        const { value } = e.target;
        let newField = setInitial(field);

        newField.postId = value.value;
        newField.url = value.url;
        onChange(
            id,
            stringifyField(newField)
        );
    }

    handleRestore = (e) => {
        e.preventDefault();
        const { id, field, onChange } = this.props;
        let newField = field;
        
        if (field.initial !== 'undefined') {
            newField.linkType = field.initial.linkType;
            newField.target = field.initial.target;
            newField.postId = field.initial.postId;
            newField.url = field.initial.url;
            onChange(
                id,
                stringifyField(newField)
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
            field
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

        let post = field.posts.find(post => post.value === field.postId);
        if (!displayField) {
            displayField = field;
        }
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
                            checked={displayField.linkType == 1 ? 'checked' : ''}
                        />Internal
				</label>
                    <label>
                        <input
                            type="radio"
                            name={name + 'linkType'}
                            value='0'
                            onChange={handleTypeChange}
                            checked={displayField.linkType == 0 ? 'checked' : ''}
                        />External
				</label>
                    <label>
                        <input
                            type="radio"
                            name={name + 'linkType'}
                            value='2'
                            onChange={handleTypeChange}
                            checked={displayField.linkType == 2 ? 'checked' : ''}
                        />Email
				</label>
                    <label>
                        <input
                            type="radio"
                            name={name + 'linkType'}
                            value='3'
                            onChange={handleTypeChange}
                            checked={displayField.linkType == 3 ? 'checked' : ''}
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
                            checked={displayField.target == '_self'}
                        />Same Tab
				</label>
                    <label>
                        <input
                            type="radio"
                            name={name + 'target'}
                            value='_blank'
                            onChange={handleTargetChange}
                            checked={displayField.target == '_blank'}
                        />New Tab
			</label>
                </fieldset>
                <button onClick={handleRestore}>Restore Saved</button>
            </div>
            {displayField.linkType == '1' ?
                <label>
                    Page
				<Select
                        value={post ? post : ''}
                        onChange={handleIdChange}
                        options={displayField.posts}
                    />
                </label>
                :
                <span></span>
            }
            {displayField.linkType == '2' ?
                <label>Email
				<input
                        type="text"
                        name={name + 'email'}
                        value={displayField.linkType == '2' ? field.url.slice(7) : ''}
                        onChange={handleEmailChange}
                    />
                </label>
                :
                <span></span>
            }
            {displayField.linkType == '3' ?
                <label>Phone
				<input
                        type="text"
                        name={name + 'phone'}
                        value={displayField.linkType == '3' ? field.url.slice(4) : ''}
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
                    value={displayField.url ? field.url : ''}
                    readOnly={parseInt(field.linkType)}
                    onChange={handleUrlChange}
                />
            </label>
            <input
                type="hidden"
                id={id}
                name={name}
                value={displayField.value}
                readOnly={true}
            />
        </div>;
    }
}

export default SmartLinkField;