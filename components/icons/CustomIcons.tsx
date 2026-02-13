import React from 'react';
import Svg, { Path, Circle, SvgProps } from 'react-native-svg';

interface IconProps extends SvgProps {
    size?: number;
    color?: string;
}

/**
 * EXACT HOME ICON
 * Matches the outline style with the rounded door.
 */
export const HomeIcon: React.FC<IconProps> = ({ size = 24, color = "#000000", ...props }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
            <Path
                d="M12 2.5L3 9.5V20.5C3 21.0523 3.44772 21.5 4 21.5H9V14H15V21.5H20C20.5523 21.5 21 21.0523 21 20.5V9.5L12 2.5Z"
                fill={color}
                stroke="none"
            />
        </Svg>
    );
};

/**
 * EXACT DISCOVER ICON
 * Matches the Solid Black Circle with White Compass Needle inside.
 */
export const DiscoverIcon: React.FC<IconProps> = ({
    size = 24,
    color = "#000000",
    ...props
}) => {
    return (
        <Svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            {...props}
        >
            {/* Circle Border */}
            <Circle
                cx="12"
                cy="12"
                r="11"
                stroke={color}
                strokeWidth="2"
                fill="none"
            />

            {/* Filled Paper Plane */}
            <Path
                d="M17.5 6L6 11L10 13L12 18L17.5 6Z"
                fill={color}
            />
        </Svg>
    );
};



/**
 * EXACT ACCOUNT ICON
 * Matches the circle outline with the user head/shoulders.
 */
export const AccountIcon: React.FC<IconProps> = ({ size = 24, color = "#000000", ...props }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
            {/* Outer Ring */}
            <Circle 
                cx="12" 
                cy="12" 
                r="10" 
                stroke={color} 
                strokeWidth={2} 
            />
            {/* Head */}
            <Circle 
                cx="12" 
                cy="9" 
                r="3" 
                stroke={color} 
                strokeWidth={2} 
            />
            {/* Shoulders (Curved) */}
            <Path
                d="M17.8 18.5C17.8 18.5 16.5 15.5 12 15.5C7.5 15.5 6.2 18.5 6.2 18.5"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
            />
        </Svg>
    );
};