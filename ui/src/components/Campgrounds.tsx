import React from 'react'

type Campgrounds = {
    campgrounds: Array<Campground> | undefined;
}

type Campground = {
    name: string;
    image: string,
    description: string
}

const Campgrounds: React.FC<Campgrounds> = ({campgrounds}) => {
    return (
        <div>
            {campgrounds && campgrounds.map((campground: Campground) => (
                <div>
                    {campground.name}
                </div>
            ))}
        </div>
    )
}

export default Campgrounds
