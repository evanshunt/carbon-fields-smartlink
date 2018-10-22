<?php
use Carbon_Fields\Carbon_Fields;
use Carbon_Field_SmartLink\SmartLink_Field;

define( 'Carbon_Field_SmartLink\\DIR', __DIR__ );

Carbon_Fields::extend( SmartLink_Field::class, function( $container ) {
	return new SmartLink_Field( $container['arguments']['type'], $container['arguments']['name'], $container['arguments']['label'] );
} );