/**
 * The external dependencies.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers, setStatic } from 'recompose';
import Select from 'react-select';

/**
 * The internal dependencies.
 */
import Field from 'fields/components/field';
import withStore from 'fields/decorators/with-store';
import withSetup from 'fields/decorators/with-setup';

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

/**
 * Render a number input field.
 *
 * @param  {Object}        props
 * @param  {String}        props.name
 * @param  {Object}        props.field
 * @param  {Function}      props.handleChange
 * @return {React.Element}
 */
export const SmartLinkField = ({
	name,
	field,
	handleTypeChange,
	handleTargetChange,
	handleUrlChange,
	handleEmailChange,
	handleTelChange,
	handleIdChange,
	handleRestore
}) => {
	let post = field.posts.find( post => post.value === field.postId );
	return <Field field={field}>
		<div className="link-config">
			<fieldset>
				<legend>Link Type</legend>
					<label>
						<input
							type="radio"
							name={name + 'linkType'}
							value='1'
							onChange={handleTypeChange}
							checked={field.linkType == 1 ? 'checked' : ''}
						/>Internal
				</label>
				<label>
					<input
						type="radio"
						name={name + 'linkType'}
						value='0'
						onChange={handleTypeChange}
						checked={field.linkType == 0 ? 'checked' : ''}
					/>External
				</label>
				<label>
					<input
						type="radio"
						name={name + 'linkType'}
						value='2'
						onChange={handleTypeChange}
						checked={field.linkType == 2 ? 'checked' : ''}
					/>Email
				</label>
				<label>
					<input
						type="radio"
						name={name + 'linkType'}
						value='3'
						onChange={handleTypeChange}
						checked={field.linkType == 3 ? 'checked' : ''}
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
						checked={field.target == '_self'}
					/>Same Tab
				</label>
				<label>
					<input
						type="radio"
						name={name + 'target'}
						value='_blank'
						onChange={handleTargetChange}
						checked={field.target == '_blank'}
					/>New Tab
			</label>
			</fieldset>
			<button onClick={handleRestore}>Restore Saved</button>
		</div>
		{ field.linkType == '1' ?
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
		{field.linkType == '2' ?
			<label>Email
				<input
					type="text"
					name={name + 'email'}
					value={field.linkType == '2' ? field.url.slice(7) : ''}
					onChange={handleEmailChange}
				/>
			</label>
			:
			<span></span>
		}
		{field.linkType == '3' ?
			<label>Phone
				<input
					type="text"
					name={name + 'phone'}
					value={field.linkType == '3' ? field.url.slice(4) : ''}
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
				value={field.url ? field.url : ''}
				readOnly={parseInt(field.linkType)}
				onChange={handleUrlChange}
			/>
		</label>
		<input
			type="text"
			id={field.id}
			name={name}
			value={field.value}
			readOnly={true}
		/>
	</Field>;
}

/**
 * Validate the props.
 *
 * @type {Object}
 */
SmartLinkField.propTypes = {
	name: PropTypes.string,
	field: PropTypes.shape({
		id: PropTypes.string,
		value: PropTypes.string,
		min: PropTypes.number,
		max: PropTypes.number,
		step: PropTypes.number,
	}),
	handleChange: PropTypes.func,
};

/**
 * The enhancer.
 *
 * @type {Function}
 */
export const enhance = compose(
	/**
	 * Connect to the Redux store.
	 */
	withStore(),

	/**
	 * Attach the setup hooks.
	 */
	withSetup(),

	/**
	 * The handlers passed to the component.
	 */
	withHandlers({
		handleTypeChange: ({ field, setFieldValue }) => ({ target: { value } }) => {
			field = setInitial(field);
			field.postId = '';
			field.linkType = value;
			if (value) {
				let post = field.posts.find(post => post.value === field.postId);
				field.url = (typeof post !== 'undefined') ? post.url : '';
			}
			setFieldValue(
				field.id,
				stringifyField(field)
			);
		},
		handleTargetChange: ({ field, setFieldValue }) => ({ target: { value } }) => {
			field = setInitial(field);
			field.target = value;
			setFieldValue(
				field.id,
				stringifyField(field)
			);
		},
		handleUrlChange: ({ field, setFieldValue }) => ({ target: { value } }) => {
			field = setInitial(field);
			field.url = value;
			setFieldValue(
				field.id,
				stringifyField(field)
			);
		},
		handleEmailChange: ({ field, setFieldValue }) => ({ target: { value } }) => {
			field = setInitial(field);
			field.url = `mailto:${value}`;
			setFieldValue(
				field.id,
				stringifyField(field)
			);
		},
		handleTelChange: ({ field, setFieldValue }) => ({ target: { value } }) => {
			field = setInitial(field);
			field.url = `tel:${value.replace(/\s/g, '')}`;
			setFieldValue(
				field.id,
				stringifyField(field)
			);
		},
		handleIdChange: ({ field, setFieldValue }) => (value) => {
			field = setInitial(field);
			field.postId = value.value;
			field.url = value.url;
			setFieldValue(
				field.id,
				stringifyField(field)
			);
		},
		handleRestore: ({ field, setFieldValue }) => (event) => {
			event.preventDefault();

			if (field.initial !== 'undefined') {
				field.linkType = field.initial.linkType;
				field.target = field.initial.target;
				field.postId = field.initial.postId;
				field.url = field.initial.url;
				setFieldValue(
					field.id,
					stringifyField(field)
				);
			}
		}
	})
);

export default setStatic('type', [
	'smartlink',
])(enhance(SmartLinkField));

