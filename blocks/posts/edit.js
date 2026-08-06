import { __ } from '@wordpress/i18n'
import { useBlockProps, InspectorControls } from '@wordpress/block-editor'

import { useSelect } from '@wordpress/data'

import {
    PanelBody,
    SelectControl,
    // eslint-disable-next-line @wordpress/no-unsafe-wp-apis
    __experimentalNumberControl as NumberControl,
} from '@wordpress/components'
import { useMemo } from 'react'

export default function Edit({ attributes, setAttributes }) {
    const { postType, postCount } = attributes

    // get all postTypes on load
    const availablePostTypes = useSelect((select) => {
        return select('core').getPostTypes({
            per_page: -1,
        })
    }, [])

    const postTypes = useMemo(() => {
        if (!availablePostTypes) {
            return []
        }

        return availablePostTypes
            .filter(
                (selectedPostType) =>
                    selectedPostType.viewable &&
                    selectedPostType.slug !== 'page' &&
                    selectedPostType.slug !== 'attachment'
            )
            .map((selectedPostType) => ({
                value: selectedPostType.slug,
                label: selectedPostType.name,
            }))
    }, [availablePostTypes])

    const posts = useSelect(
        (select) => {
            return select('core').getEntityRecords('postType', postType, {
                per_page: postCount,
            })
        },
        [postType, postCount]
    )

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Post Type', 'house-theme')}>
                    <SelectControl
                        label={__('Select Post Type', 'house-theme')}
                        value={postType}
                        options={[
                            {
                                value: '',
                                label: __('Select Post Type', 'house-theme'),
                            },
                            ...postTypes,
                        ]}
                        onChange={(type) => setAttributes({ postType: type })}
                    />
                    <NumberControl
                        label={__('Number of Posts', 'house-theme')}
                        value={postCount}
                        onChange={(count) =>
                            setAttributes({ postCount: count })
                        }
                    ></NumberControl>
                </PanelBody>
            </InspectorControls>
            <div {...useBlockProps()}>
                {!postType && __('Select a Post Type.', 'house-theme')}

                {!posts && __('Loading', 'house-theme')}

                {posts && posts.length === 0 && __('No posts', 'house-theme')}

                {posts && posts.length > 0 && (
                    <ul>
                        {posts.map((post) => (
                            <li key={post.id}>{post.title.raw}</li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    )
}
