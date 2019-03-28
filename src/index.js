/**
 * External dependencies.
 */
import { registerFieldType } from '@carbon-fields/core';

/**
 * Internal dependencies.
 */
import './style.scss';
import SmartLinkField from './main';

registerFieldType('smartlink', SmartLinkField);
