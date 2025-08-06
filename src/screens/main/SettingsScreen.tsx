import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { styled } from 'nativewind';
import { useChildren } from '@/contexts/ChildrenContext';
import { 
  Screen, 
  Container, 
  VStack, 
  HStack, 
  Card, 
  Button, 
  Input,
  H1, 
  H2, 
  H3, 
  Body, 
  Caption,
  PrimaryButton,
  colors
} from '@/components/design-system';
import { PermissionManager, FamilyMember } from '@/components/auth';

// Mock data for demonstration
const mockFamily = {
  id: '1',
  name: 'The Johnson Family',
  inviteCode: 'ABC123',
  memberCount: 3
};

const mockChildren = [
  { id: '1', name: 'Sam', age: 4, avatar: '👦', birthdate: '2020-03-15' },
  { id: '2', name: 'Sebbie', age: 2, avatar: '👶', birthdate: '2022-08-22' },
  { id: '3', name: 'Dee-Dee-Dee', age: 6, avatar: '🧒', birthdate: '2018-11-10' }
];

const mockFamilyMembers: FamilyMember[] = [
  { 
    id: '1', 
    name: 'Mom', 
    email: 'mom@example.com', 
    role: 'admin', 
    avatar: '👩',
    isCurrentUser: true,
    joinedAt: new Date('2024-01-15')
  },
  { 
    id: '2', 
    name: 'Dad', 
    email: 'dad@example.com', 
    role: 'caregiver', 
    avatar: '👨',
    joinedAt: new Date('2024-01-16')
  },
  { 
    id: '3', 
    name: 'Grandma', 
    email: 'grandma@example.com', 
    role: 'viewer', 
    avatar: '👵',
    joinedAt: new Date('2024-02-01')
  }
];

const StyledScrollView = styled(ScrollView);

const SettingsScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [showAddChild, setShowAddChild] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [showPermissionManager, setShowPermissionManager] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(mockFamilyMembers);

  const handleInviteFamily = () => {
    Alert.alert(
      'Invite Family Member',
      `Share this invite code: ${mockFamily.inviteCode}\n\nOr send a direct invitation link to their email.`,
      [
        { text: 'Copy Code', onPress: () => {} },
        { text: 'Send Link', onPress: () => {} },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleAddChild = () => {
    if (!newChildName.trim()) {
      Alert.alert('Error', 'Please enter a name for the child');
      return;
    }
    
    Alert.alert('Child Added', `${newChildName} has been added to your family!`, [
      { text: 'OK', onPress: () => { setNewChildName(''); setShowAddChild(false); } }
    ]);
  };

  const handleRemoveChild = (childName: string) => {
    Alert.alert(
      'Remove Child',
      `Are you sure you want to remove ${childName} from your family? This will delete all their meal history.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => {} }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => {} }
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Choose export format:',
      [
        { text: 'PDF Report', onPress: () => {} },
        { text: 'CSV Data', onPress: () => {} },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  // Permission Manager handlers
  const handleRoleChange = async (memberId: string, newRole: any) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setFamilyMembers(prev => 
      prev.map(member => 
        member.id === memberId 
          ? { ...member, role: newRole }
          : member
      )
    );
    
    Alert.alert('Success', 'Role updated successfully!');
  };

  const handleRemoveMember = async (memberId: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setFamilyMembers(prev => prev.filter(member => member.id !== memberId));
    Alert.alert('Success', 'Member removed from family');
  };

  const renderSettingItem = (
    icon: string,
    title: string,
    subtitle: string,
    onPress?: () => void,
    rightElement?: React.ReactNode,
    destructive = false
  ) => (
    <TouchableOpacity 
      onPress={onPress}
      className={`p-4 bg-background-card rounded-lg border border-border ${
        destructive ? 'border-error-light' : ''
      }`}
    >
      <HStack className="items-center justify-between">
        <HStack className="items-center flex-1">
          <Text className="text-2xl mr-3">{icon}</Text>
          <VStack space={1} className="flex-1">
            <Body className={`font-medium ${destructive ? 'text-error' : 'text-foreground'}`}>
              {title}
            </Body>
            <Caption className="text-foreground-muted">{subtitle}</Caption>
          </VStack>
        </HStack>
        {rightElement || <Text className="text-primary">→</Text>}
      </HStack>
    </TouchableOpacity>
  );

  return (
    <Screen>
      <StyledScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Container>
          <VStack space={6} className="py-4">
            
            {/* Header */}
            <VStack space={2}>
              <H1 className="text-center">Settings</H1>
              <Caption className="text-center text-foreground-muted">
                Manage your family and app preferences
              </Caption>
            </VStack>

            {/* Family Information */}
            <Card>
              <VStack space={4}>
                <HStack className="items-center justify-between">
                  <H3>Family</H3>
                  <TouchableOpacity onPress={handleInviteFamily}>
                    <Caption className="text-primary">Invite Members</Caption>
                  </TouchableOpacity>
                </HStack>
                
                <VStack space={3}>
                  <HStack className="items-center">
                    <Text className="text-2xl mr-3">👨‍👩‍👧‍👦</Text>
                    <VStack space={1}>
                      <Body className="font-medium">{mockFamily.name}</Body>
                      <Caption className="text-foreground-muted">
                        {familyMembers.length} members • {mockChildren.length} children
                      </Caption>
                    </VStack>
                  </HStack>
                  
                  <VStack space={2}>
                    <Caption className="text-foreground-muted font-medium">Family Members:</Caption>
                    {familyMembers.map((member) => (
                      <HStack key={member.id} className="items-center justify-between">
                        <HStack className="items-center">
                          <Text className="mr-2">{member.avatar}</Text>
                          <VStack space={1}>
                            <Caption className="font-medium">
                              {member.name}{member.isCurrentUser ? ' (You)' : ''}
                            </Caption>
                            <Caption className="text-foreground-light text-xs">{member.role}</Caption>
                          </VStack>
                        </HStack>
                        {member.role === 'admin' && (
                          <View className="px-2 py-1 bg-primary-light rounded">
                            <Caption className="text-primary text-xs">Admin</Caption>
                          </View>
                        )}
                      </HStack>
                    ))}
                  </VStack>
                  
                  {/* Manage Permissions Button */}
                  <TouchableOpacity 
                    onPress={() => setShowPermissionManager(true)}
                    className="p-3 bg-primary-light rounded-lg border border-primary-DEFAULT"
                  >
                    <HStack className="items-center justify-center">
                      <Text className="text-lg mr-2">👑</Text>
                      <Body className="font-medium text-primary">Manage Family Permissions</Body>
                    </HStack>
                  </TouchableOpacity>
                </VStack>
              </VStack>
            </Card>

            {/* Children Management */}
            <Card>
              <VStack space={4}>
                <HStack className="items-center justify-between">
                  <H3>Children</H3>
                  <TouchableOpacity onPress={() => setShowAddChild(!showAddChild)}>
                    <Caption className="text-primary">
                      {showAddChild ? 'Cancel' : 'Add Child'}
                    </Caption>
                  </TouchableOpacity>
                </HStack>
                
                {showAddChild && (
                  <VStack space={3} className="p-3 bg-background-secondary rounded-lg">
                    <Input
                      placeholder="Child's name"
                      value={newChildName}
                      onChangeText={setNewChildName}
                    />
                    <Button onPress={handleAddChild} size="small">
                      <Text className="text-primary">Add Child</Text>
                    </Button>
                  </VStack>
                )}
                
                <VStack space={3}>
                  {mockChildren.map((child) => (
                    <HStack key={child.id} className="items-center justify-between p-3 bg-background-secondary rounded-lg">
                      <HStack className="items-center">
                        <Text className="text-2xl mr-3">{child.avatar}</Text>
                        <VStack space={1}>
                          <Body className="font-medium">{child.name}</Body>
                          <Caption className="text-foreground-muted">{child.age} years old</Caption>
                        </VStack>
                      </HStack>
                      <TouchableOpacity onPress={() => handleRemoveChild(child.name)}>
                        <Text className="text-error">Remove</Text>
                      </TouchableOpacity>
                    </HStack>
                  ))}
                </VStack>
              </VStack>
            </Card>

            {/* App Preferences */}
            <Card>
              <VStack space={4}>
                <H3>App Preferences</H3>
                
                <VStack space={3}>
                  <HStack className="items-center justify-between">
                    <HStack className="items-center">
                      <Text className="text-2xl mr-3">🔔</Text>
                      <VStack space={1}>
                        <Body className="font-medium">Notifications</Body>
                        <Caption className="text-foreground-muted">Meal reminders and family updates</Caption>
                      </VStack>
                    </HStack>
                    <Switch
                      value={notifications}
                      onValueChange={setNotifications}
                      trackColor={{ false: colors.background.muted, true: colors.primary.light }}
                      thumbColor={notifications ? colors.primary.DEFAULT : colors.foreground.light}
                    />
                  </HStack>
                  
                  <HStack className="items-center justify-between">
                    <HStack className="items-center">
                      <Text className="text-2xl mr-3">🎤</Text>
                      <VStack space={1}>
                        <Body className="font-medium">Voice Logging</Body>
                        <Caption className="text-foreground-muted">Enable voice-to-text meal entry</Caption>
                      </VStack>
                    </HStack>
                    <Switch
                      value={voiceEnabled}
                      onValueChange={setVoiceEnabled}
                      trackColor={{ false: colors.background.muted, true: colors.primary.light }}
                      thumbColor={voiceEnabled ? colors.primary.DEFAULT : colors.foreground.light}
                    />
                  </HStack>
                  
                  <HStack className="items-center justify-between">
                    <HStack className="items-center">
                      <Text className="text-2xl mr-3">🔄</Text>
                      <VStack space={1}>
                        <Body className="font-medium">Auto Sync</Body>
                        <Caption className="text-foreground-muted">Automatically sync with family devices</Caption>
                      </VStack>
                    </HStack>
                    <Switch
                      value={autoSync}
                      onValueChange={setAutoSync}
                      trackColor={{ false: colors.background.muted, true: colors.primary.light }}
                      thumbColor={autoSync ? colors.primary.DEFAULT : colors.foreground.light}
                    />
                  </HStack>
                </VStack>
              </VStack>
            </Card>

            {/* Data & Privacy */}
            <Card>
              <VStack space={4}>
                <H3>Data & Privacy</H3>
                
                <VStack space={2}>
                  {renderSettingItem(
                    '📊',
                    'Export Data',
                    'Download your family\'s meal data',
                    handleExportData
                  )}
                  
                  {renderSettingItem(
                    '🔒',
                    'Privacy Policy',
                    'View our privacy policy',
                    () => {}
                  )}
                  
                  {renderSettingItem(
                    '📋',
                    'Terms of Service',
                    'View terms of service',
                    () => {}
                  )}
                </VStack>
              </VStack>
            </Card>

            {/* Support */}
            <Card>
              <VStack space={4}>
                <H3>Support</H3>
                
                <VStack space={2}>
                  {renderSettingItem(
                    '❓',
                    'Help & FAQ',
                    'Get help using LittleMeals',
                    () => {}
                  )}
                  
                  {renderSettingItem(
                    '📝',
                    'Send Feedback',
                    'Help us improve the app',
                    () => {}
                  )}
                  
                  {renderSettingItem(
                    '📞',
                    'Contact Support',
                    'Get in touch with our team',
                    () => {}
                  )}
                </VStack>
              </VStack>
            </Card>

            {/* Account Actions */}
            <Card>
              <VStack space={4}>
                <H3>Account</H3>
                
                <VStack space={2}>
                  {renderSettingItem(
                    '👤',
                    'Account Information',
                    'View and edit your profile',
                    () => {}
                  )}
                  
                  {renderSettingItem(
                    '🔐',
                    'Change Password',
                    'Update your account password',
                    () => {}
                  )}
                  
                  {renderSettingItem(
                    '🚪',
                    'Sign Out',
                    'Sign out of your account',
                    handleLogout,
                    undefined,
                    true
                  )}
                </VStack>
              </VStack>
            </Card>

            {/* App Information */}
            <Card>
              <VStack space={3}>
                <H3>App Information</H3>
                
                <VStack space={2}>
                  <HStack className="items-center justify-between">
                    <Caption className="text-foreground-muted">Version</Caption>
                    <Caption>1.0.0 (Beta)</Caption>
                  </HStack>
                  
                  <HStack className="items-center justify-between">
                    <Caption className="text-foreground-muted">Build</Caption>
                    <Caption>2024.01.001</Caption>
                  </HStack>
                </VStack>
              </VStack>
            </Card>

            <View className="pb-8" />

          </VStack>
        </Container>
      </StyledScrollView>

      {/* Permission Manager Modal */}
      {showPermissionManager && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: colors.background.DEFAULT,
          zIndex: 1000,
        }}>
          {/* Header with Close Button */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
            paddingTop: 60, // Account for status bar
            borderBottomWidth: 1,
            borderBottomColor: colors.border.DEFAULT,
            backgroundColor: colors.background.card,
          }}>
            <TouchableOpacity onPress={() => setShowPermissionManager(false)}>
              <Text style={{ fontSize: 24 }}>←</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.foreground.DEFAULT }}>
              Family Permissions
            </Text>
            <View style={{ width: 24 }} />
          </View>
          
          {/* Permission Manager Component */}
          <View style={{ flex: 1 }}>
            <PermissionManager
              members={familyMembers}
              currentUserId="1"
              onRoleChange={handleRoleChange}
              onRemoveMember={handleRemoveMember}
            />
          </View>
        </View>
      )}
    </Screen>
  );
};

export default SettingsScreen;