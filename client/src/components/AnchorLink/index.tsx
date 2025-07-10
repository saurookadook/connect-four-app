import React from 'react';

type AnchorTagProps = React.JSX.IntrinsicElements['a'];

const AnchorLink: React.FC<AnchorTagProps> = ({ children, href, ...props }) => {
    // function AnchorLink<>({ children, href, ...props }) {
    return (
        <a href={href} {...props}>
            {children}
        </a>
    );
};

export default AnchorLink;
