<?php

namespace Carbon_Field_SmartLink;

use Carbon_Fields\Field\Field;
use App\Debug;

class SmartLink_Field extends Field
{

    protected $internal = true;
    protected $target = "_self";
    protected $postId = 0;
    protected $url = '';

    /**
     * Prepare the field type for use
     * Called once per field type when activated
     */
    public static function field_type_activated()
    {
        $dir = \Carbon_Field_SmartLink\DIR . '/languages/';
        $locale = get_locale();
        $path = $dir . $locale . '.mo';
        load_textdomain('carbon-field-SmartLink', $path);
    }

    /**
     * Enqueue scripts and styles in admin
     * Called once per field type
     */
    public static function admin_enqueue_scripts()
    {
        $root_uri = \Carbon_Fields\Carbon_Fields::directory_to_url(\Carbon_Field_SmartLink\DIR);

        // Enqueue JS
        wp_enqueue_script('carbon-field-SmartLink', $root_uri . '/assets/js/bundle.js', array( 'carbon-fields-boot' ));

        // Enqueue CSS
        wp_enqueue_style('carbon-field-SmartLink', $root_uri . '/assets/css/field.css');
    }

    /**
     * Load the field value from an input array based on it's name
     *
     * @param array $input Array of field names and values.
     */
    public function set_value_from_input( $input )
    {
        parent::set_value_from_input($input);

        $value = $this->get_value();

        $this->set_value($value);
    }

    /**
     * Returns an array that holds the field data, suitable for JSON representation.
     *
     * @param  bool $load Should the value be loaded from the database or use the value from the current instance.
     * @return array
     */
    public function to_json( $load )
    {
        $field_data = parent::to_json($load);

        $json = json_decode($field_data['value']);

        if (is_object($json)) {
            $this->internal = (property_exists($json, 'internal')) ? $json->internal : $this->internal;
            $this->target = (property_exists($json, 'target')) ? $json->target : $this->target;
            $this->postId = (property_exists($json, 'postId')) ? $json->postId : $this->postId;
            $this->url = (property_exists($json, 'url')) ? $json->url : $this->url;
        }

        $field_data = array_merge(
            $field_data,
            [
                'posts' => $this->get_posts(),
                'internal' => $this->internal,
                'target' => $this->target,
                'postId' => $this->postId,
                'url' => $this->url
            ]
        );

        return $field_data;
    }
        
    /**
     * Get Posts and archives
     */
    function get_posts()
    {
        $types = array_values(get_post_types(['public' => true]));

        return array_merge($this->get_archives_from_types($types), $this->get_posts_from_types($types));
    }

    function get_archives_from_types($types)
    {
        $types = array_map(function ($type) {
            return [
                'label' => 'Archive: ' . ucfirst($type),
                'url' => get_post_type_archive_link($type),
                'value' => $type
            ];
        }, $types);

        $types = array_filter($types, function ($type) {
            return $type['url'];
        });

        return array_values($types);
    }

    function get_posts_from_types($types)
    {
        $posts = [];

        foreach ($types as $type) {
            $typePosts = get_posts([
                'post_type' => $type,
                'post_status' => 'publish',
                'numberposts' => -1
            ]);

            foreach ($typePosts as $post) {
                array_push(
                    $posts,
                    [
                        'label' => ucfirst($type) . ': ' . $post->post_title,
                        'url' => get_permalink($post->ID),
                        'value' => $post->ID
                    ]
                );
            }
        }

        return $posts;
    }
}
