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
	internal: field.internal,
	target: field.target,
	postId: field.postId,
	url: field.url
});

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
	handleIdChange
}) => {
	let post = field.posts.find( post => post.value === field.postId );
	return <Field field={field}>
		<div className="link-config">
			<fieldset>
				<legend>Link Type</legend>
				<label>
					<input
						type="radio"
						name={name + 'internal'}
						value='1'
						onChange={handleTypeChange}
						checked={field.internal == '1'}
					/>Internal
			</label>
				<label>
					<input
						type="radio"
						name={name + 'internal'}
						value='0'
						onChange={handleTypeChange}
						checked={field.internal == '0'}
					/>External
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
		</div>
		{ field.internal == '1' ?
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
		<label>
			URL
			<input
				type="text"
				name={name + 'url'}
				value={field.url ? field.url : ''}
				readOnly={field.internal == '1'}
				onChange={handleUrlChange}
			/>			
		</label>
		<input
			type="hidden"
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
			field.internal = value;
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
			field.target = value;
			setFieldValue(
				field.id,
				stringifyField(field)
			);
		},
		handleUrlChange: ({ field, setFieldValue }) => ({ target: { value } }) => {
			field.url = value;
			setFieldValue(
				field.id,
				stringifyField(field)
			);
		},
		handleIdChange: ({ field, setFieldValue }) => (value) => {
			field.postId = value.value;
			field.url = value.url;
			setFieldValue(
				field.id,
				stringifyField(field)
			);
		}
	})
);

export default setStatic('type', [
	'smartlink',
])(enhance(SmartLinkField));

