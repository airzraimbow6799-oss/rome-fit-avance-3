import React, { useState } from 'react';
import { motion } from 'motion/react';
import { C, SizeName } from './tokens';
import { Mannequin } from './Mannequin';
import { ImageWithFallback } from '../figma/ImageWithFallback';

const PRODUCTS = [
  {
    id: 1,
    name: 'Polo Slim Premium',
    price: 79.90,
    oldPrice: null,
    size: 'S' as SizeName,
    shirtColor: '#ffffff',
    colors: ['#ffffff', '#111111'],
    badge: 'NUEVO',
    badgeBg: C.black,
    img: 'https://images.unsplash.com/photo-1671438118097-479e63198629?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
  },
  {
    id: 2,
    name: 'Polo Oversized Beige',
    price: 89.90,
    oldPrice: null,
    size: 'M' as SizeName,
    shirtColor: '#d4b896',
    colors: ['#d4b896', '#111111', '#ffffff'],
    badge: null,
    badgeBg: '',
    img: 'https://images.unsplash.com/photo-1758538843183-c31eee9aca87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
  },
  {
    id: 3,
    name: 'Hoodie Rome Classic',
    price: 149.90,
    oldPrice: 179.90,
    size: 'L' as SizeName,
    shirtColor: '#111111',
    colors: ['#111111', '#666666'],
    badge: 'BESTSELLER',
    badgeBg: C.red,
    img: 'https://images.unsplash.com/photo-1762575910569-46971cd69df3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
  },
  {
    id: 4,
    name: 'Jogger Oversized',
    price: 109.90,
    oldPrice: null,
    size: 'M' as SizeName,
    shirtColor: '#333333',
    colors: ['#111111', '#888888', '#ffffff'],
    badge: null,
    badgeBg: '',
    img: 'https://images.unsplash.com/photo-1552902875-9ac1f9fe0c07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
  },
];

interface ProductCardProps {
  product: typeof PRODUCTS[0];
}

function ProductCard({ product }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [activeColor, setActiveColor] = useState(0);
  const [wishlist, setWishlist] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        backgroundColor: C.white,
        border: `1px solid ${hovered ? '#aaaaaa' : C.border}`,
        borderRadius: 6,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: hovered ? '0 4px 20px rgba(0,0,0,0.08)' : 'none',
        fontFamily: 'Inter, sans-serif',
        position: 'relative',
      }}
    >
      {/* Badge */}
      {product.badge && (
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            backgroundColor: product.badgeBg,
            color: C.white,
            fontSize: 10,
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: 20,
            letterSpacing: '0.5px',
            zIndex: 2,
          }}
        >
          {product.badge}
        </div>
      )}

      {/* Wishlist */}
      <button
        onClick={(e) => { e.stopPropagation(); setWishlist((v) => !v); }}
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          background: 'rgba(255,255,255,0.85)',
          border: 'none',
          borderRadius: '50%',
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 2,
          fontSize: 16,
          color: wishlist ? C.red : C.gray,
          transition: 'color 0.15s',
        }}
      >
        {wishlist ? '♥' : '♡'}
      </button>

      {/* Image */}
      <div
        style={{
          height: 260,
          backgroundColor: '#f5f5f5',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <ImageWithFallback
          src={product.img}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
            transition: 'transform 0.4s ease',
          }}
        />

        {/* Quick add on hover */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
          transition={{ duration: 0.18 }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '0 10px 10px',
          }}
        >
          <button
            style={{
              width: '100%',
              height: 40,
              backgroundColor: C.black,
              color: C.white,
              border: 'none',
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.5px',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            AGREGAR RÁPIDO
          </button>
        </motion.div>
      </div>

      {/* Info */}
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: C.black, marginBottom: 6 }}>
          {product.name}
        </div>

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.black }}>
            S/. {product.price.toFixed(2)}
          </span>
          {product.oldPrice && (
            <span
              style={{
                fontSize: 12,
                color: C.gray,
                textDecoration: 'line-through',
              }}
            >
              S/. {product.oldPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Color swatches */}
        <div style={{ display: 'flex', gap: 6 }}>
          {product.colors.map((hex, i) => (
            <button
              key={hex}
              onClick={(e) => { e.stopPropagation(); setActiveColor(i); }}
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                backgroundColor: hex,
                border: `${i === activeColor ? 2 : 1}px solid ${i === activeColor ? C.black : hex === '#ffffff' ? '#cccccc' : hex}`,
                cursor: 'pointer',
                outline: i === activeColor ? `2px solid ${C.black}` : 'none',
                outlineOffset: 2,
                transition: 'all 0.15s',
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function RelatedProducts() {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Section header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <h2
          style={{
            fontSize: 20,
            fontWeight: 500,
            color: C.black,
            margin: 0,
            letterSpacing: '-0.3px',
          }}
        >
          También te puede interesar
        </h2>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          style={{
            fontSize: 12,
            color: C.gray,
            textDecoration: 'none',
            fontWeight: 600,
            letterSpacing: '0.3px',
            borderBottom: `1px solid ${C.border}`,
            paddingBottom: 2,
          }}
        >
          VER COLECCIÓN →
        </a>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 16,
        }}
      >
        {PRODUCTS.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
