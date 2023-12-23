import React from 'react';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import Box from '@mui/material/Box';

interface RatingStarsProps {
    rating: number;
    totalStars: number;
}

export default function RatingStars({ rating, totalStars = 5 }: RatingStarsProps) {
    const fullStars = Math.floor(rating);                              // 완전히 채워진 별의 개수
    const halfStar = rating % 1 !== 0;                                 // 반쪽 별이 필요한지 여부
    const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0);    // 비어 있는 별의 개수

    return (
        <Box>
            {[...Array(fullStars)].map((_, index) => (
                <StarIcon key={`full-${index}`} />
            ))}
            {halfStar && <StarHalfIcon key="half" />}
            {[...Array(emptyStars)].map((_, index) => (
                <StarBorderIcon key={`empty-${index}`} />
            ))}
        </Box>
    );
};
