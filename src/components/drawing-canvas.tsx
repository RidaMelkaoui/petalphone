import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PanResponder, Pressable, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { colors, fonts, radii, spacing } from '@/constants/theme';
import type { DrawingTool, Point, Stroke } from '@/types/game';

function makeId() {
  return `stroke-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function pathFor(points: Point[], width: number, height: number) {
  if (!points.length) return '';
  const scaled = points.map((point) => ({ x: point.x * width, y: point.y * height }));
  if (scaled.length === 1) {
    const point = scaled[0];
    return `M ${point.x} ${point.y} l 0.1 0.1`;
  }
  return scaled.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' ');
}

export function StrokeDrawing({ strokes, width = 320, height = 250 }: { strokes: Stroke[]; width?: number; height?: number }) {
  return (
    <Svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
      {strokes.map((stroke) => (
        <Path
          key={stroke.id}
          d={pathFor(stroke.points, width, height)}
          fill="none"
          stroke={stroke.tool === 'erase' ? colors.surface : colors.cocoa}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={stroke.width}
        />
      ))}
    </Svg>
  );
}

export function DrawingCanvas({
  value,
  onChange,
  onDrawingChange,
}: {
  value: Stroke[];
  onChange: (strokes: Stroke[]) => void;
  onDrawingChange?: (drawing: boolean) => void;
}) {
  const [tool, setTool] = useState<DrawingTool>('pen');
  const [redo, setRedo] = useState<Stroke[]>([]);
  const [size, setSize] = useState({ width: 320, height: 326 });
  const strokesRef = useRef(value);
  useEffect(() => {
    strokesRef.current = value;
  }, [value]);

  const pointFromEvent = useCallback((x: number, y: number): Point => ({
    x: Math.max(0, Math.min(1, x / Math.max(size.width, 1))),
    y: Math.max(0, Math.min(1, y / Math.max(size.height, 1))),
  }), [size.height, size.width]);

  // The ref is only read by responder callbacks after a pointer event begins.
  // eslint-disable-next-line react-hooks/refs
  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (event) => {
      onDrawingChange?.(true);
      setRedo([]);
      const stroke: Stroke = {
        id: makeId(),
        points: [pointFromEvent(event.nativeEvent.locationX, event.nativeEvent.locationY)],
        tool,
        width: tool === 'erase' ? 26 : 5,
      };
      onChange([...strokesRef.current, stroke]);
    },
    onPanResponderMove: (event) => {
      const point = pointFromEvent(event.nativeEvent.locationX, event.nativeEvent.locationY);
      const current = strokesRef.current;
      const lastStroke = current[current.length - 1];
      if (!lastStroke) return;
      const lastPoint = lastStroke.points[lastStroke.points.length - 1];
      if (Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y) < 0.006) return;
      onChange([
        ...current.slice(0, -1),
        { ...lastStroke, points: [...lastStroke.points, point] },
      ]);
    },
    onPanResponderRelease: () => onDrawingChange?.(false),
    onPanResponderTerminate: () => onDrawingChange?.(false),
    onShouldBlockNativeResponder: () => true,
  }), [onChange, onDrawingChange, pointFromEvent, tool]);

  const toolButton = (label: string, active: boolean, onPress: () => void) => (
    <Pressable
      key={label}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 42,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: active ? colors.cornflower : colors.border,
        borderRadius: radii.capsule,
        backgroundColor: active ? colors.cornflower : colors.surface,
        opacity: pressed ? 0.7 : 1,
        paddingHorizontal: 15,
      })}
    >
      <Text style={{ color: active ? colors.white : colors.cocoa, fontFamily: fonts.bodyBold, fontSize: 14 }}>{label}</Text>
    </Pressable>
  );

  return (
    <View style={{ gap: spacing.sm }}>
      <View
        accessibilityLabel="Drawing canvas"
        onLayout={(event) => setSize(event.nativeEvent.layout)}
        style={{
          height: 326,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radii.medium,
          backgroundColor: colors.surface,
        }}
        {...panResponder.panHandlers}
      >
        {value.length === 0 ? (
          <View pointerEvents="none" style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: colors.cocoaSoft, fontFamily: fonts.body, fontSize: 15 }}>Draw here</Text>
          </View>
        ) : null}
        <StrokeDrawing strokes={value} width={size.width} height={size.height} />
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, borderWidth: 1, borderColor: colors.border, borderRadius: radii.medium, backgroundColor: colors.surface, padding: spacing.sm }}>
        {toolButton('Pen', tool === 'pen', () => setTool('pen'))}
        {toolButton('Erase', tool === 'erase', () => setTool('erase'))}
        {toolButton('Undo', false, () => {
          const last = value[value.length - 1];
          if (!last) return;
          setRedo((current) => [last, ...current]);
          onChange(value.slice(0, -1));
        })}
        {toolButton('Redo', false, () => {
          const next = redo[0];
          if (!next) return;
          onChange([...value, next]);
          setRedo((current) => current.slice(1));
        })}
        {toolButton('Clear', false, () => {
          if (!value.length) return;
          setRedo(value);
          onChange([]);
        })}
      </View>
    </View>
  );
}
